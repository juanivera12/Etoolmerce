import { useState, useCallback } from 'react';
import * as tf from '@tensorflow/tfjs';
import * as nsfwjs from 'nsfwjs';

export const useContentModeration = () => {
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [model, setModel] = useState(null);

    // Load model once (lazy load)
    const loadModel = async () => {
        if (model) return model;
        console.log("Loading NSFW model...");
        const loadedModel = await nsfwjs.load();
        setModel(loadedModel);
        return loadedModel;
    };

    const validateImageContent = useCallback(async (imageElementOrFile) => {
        setIsAnalyzing(true);
        try {
            const currentModel = await loadModel();

            let imgToClassify = imageElementOrFile;

            // If it's a File object, we need to create an HTMLImageElement
            if (imageElementOrFile instanceof File) {
                imgToClassify = await new Promise((resolve, reject) => {
                    const img = document.createElement('img');
                    img.src = URL.createObjectURL(imageElementOrFile);
                    img.onload = () => resolve(img);
                    img.onerror = reject;
                });
            }

            const predictions = await currentModel.classify(imgToClassify);
            console.log("NSFW Predictions:", predictions);

            // Check for Porn or Hentai > 60%
            const inappropriate = predictions.find(p =>
                (p.className === 'Porn' || p.className === 'Hentai') && p.probability > 0.60
            );

            if (inappropriate) {
                throw new Error(`Imagen rechazada por contenido inapropiado (${inappropriate.className}: ${(inappropriate.probability * 100).toFixed(0)}%). Por favor sube una imagen segura.`);
            }

            return true; // Safe
        } catch (err) {
            console.error("Content Moderation Error:", err);
            throw err;
        } finally {
            setIsAnalyzing(false);
        }
    }, [model]);

    return {
        validateImageContent,
        isAnalyzing
    };
};
