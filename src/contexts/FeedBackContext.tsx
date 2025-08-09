import React, { createContext, useContext, useState, useCallback, ReactNode } from "react";

export type FeedbackApiResponse = {
    id: string;
    formularioId: string;
    envioId: string;
    respostas: { perguntaId: string; resposta: any }[];
    dataCriacao: string;
    dataExclusao?: string | null;
};

export type FeedbackApiRequest = {
    formularioId: string;
    envioId: string;
    respostas: { perguntaId: string; resposta: any }[];
};

type FeedBackContextType = {
    feedbacks: FeedbackApiResponse[];
    fetchFeedbacks: () => Promise<void>;
    getFeedbackByEnvioId: (envioId: string) => Promise<FeedbackApiResponse | null>;
    createFeedback: (data: FeedbackApiRequest) => Promise<FeedbackApiResponse | null>;
    deleteFeedback: (id: string) => Promise<boolean>;
    loading: boolean;
    error: string | null;
};

const FeedBackContext = createContext<FeedBackContextType | undefined>(undefined);

export const useFeedBack = () => {
    const ctx = useContext(FeedBackContext);
    if (!ctx) throw new Error("useFeedBack must be used within FeedBackProvider");
    return ctx;
};

export const FeedBackProvider = ({ children }: { children: ReactNode }) => {
    const [feedbacks, setFeedbacks] = useState<FeedbackApiResponse[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchFeedbacks = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch("/feedbacks");
            if (!res.ok) throw new Error("Erro ao buscar feedbacks");
            const data = await res.json();
            setFeedbacks(data);
        } catch (err: any) {
            setError(err.message || "Erro desconhecido");
        } finally {
            setLoading(false);
        }
    }, []);

    const getFeedbackByEnvioId = useCallback(async (envioId: string) => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch(`/feedback/${envioId}`);
            if (res.status === 404) return null;
            if (!res.ok) throw new Error("Erro ao buscar feedback");
            const data = await res.json();
            return data as FeedbackApiResponse;
        } catch (err: any) {
            setError(err.message || "Erro desconhecido");
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    const createFeedback = useCallback(async (data: FeedbackApiRequest) => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch("/feedback", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });
            if (res.status === 400) throw new Error("Dados inválidos");
            if (!res.ok) throw new Error("Erro ao criar feedback");
            const created = await res.json();
            setFeedbacks((prev) => [created, ...prev]);
            return created as FeedbackApiResponse;
        } catch (err: any) {
            setError(err.message || "Erro desconhecido");
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    const deleteFeedback = useCallback(async (id: string) => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch(`/feedback/${id}`, { method: "DELETE" });
            if (!res.ok) throw new Error("Erro ao excluir feedback");
            setFeedbacks((prev) => prev.filter((f) => f.id !== id));
            return true;
        } catch (err: any) {
            setError(err.message || "Erro desconhecido");
            return false;
        } finally {
            setLoading(false);
        }
    }, []);

    return (
        <FeedBackContext.Provider
            value={{
                feedbacks,
                fetchFeedbacks,
                getFeedbackByEnvioId,
                createFeedback,
                deleteFeedback,
                loading,
                error,
            }}
        >
            {children}
        </FeedBackContext.Provider>
    );
};