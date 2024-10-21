import { useEffect, useRef, useState, useCallback } from "react";
import Webcam from "react-webcam";
import * as cocoSsd from '@tensorflow-models/coco-ssd'; // Adjust import
import * as tf from '@tensorflow/tfjs';
import { renderPredictions } from "../utils/render-predictions";

const ObjectDetection = () => {
    const [isLoading, setIsLoading] = useState(true);
    const webCamRef = useRef(null);
    const canvasRef = useRef(null);
    const animationRef = useRef(null);

    // Load the model and start detection
    const runCoCo = useCallback(async () => {
        setIsLoading(true);
        const net = await cocoSsd.load();
        setIsLoading(false);
        detectFrame(net);
    }, []);

    // Object detection function with requestAnimationFrame for smoother updates
    const detectFrame = useCallback((net) => {
        if (
            webCamRef.current?.video?.readyState === 4 && 
            canvasRef.current
        ) {
            const video = webCamRef.current.video;
            const canvas = canvasRef.current;
            const context = canvas.getContext('2d');

            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;

            net.detect(video).then((predictions) => {
                renderPredictions(predictions, context);
            });
        }
        animationRef.current = requestAnimationFrame(() => detectFrame(net));
    }, []);

    useEffect(() => {
        runCoCo();

        return () => {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current); // Cleanup animation frame
            }
        };
    }, [runCoCo]);

    return (
        <main className="w-screen h-screen bg-black flex justify-center items-center" >
            {isLoading ? (
                <div>
                    <h1>Loading...</h1>
                </div>
            ) : (
                <section className="w-full lg:w-[60%] h-full lg:my-3 p-3 relative flex justify-center items-center p-1.5 shadow-md border-2 border-gray-200 rounded-md">
                    <Webcam
                        ref={webCamRef}
                        className=" w-full h-full rounded-md w-full "
                        muted
                    />
                    <canvas
                        ref={canvasRef}
                        className="absolute animate-pulse z-10 w-full mx-auto my-auto lg:h-[720px] shadow-md rounded-md "
                    />
                </section>
            )}
        </main>
    );
};

export default ObjectDetection;
