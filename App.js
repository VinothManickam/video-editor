import React, { useState, useRef, useEffect } from 'react';
import ReactPlayer from 'react-player';
import axios from 'axios';

function App() {
    const [videoUrl, setVideoUrl] = useState('');
    const [annotations, setAnnotations] = useState([]);
    const [comment, setComment] = useState('');
    const playerRef = useRef(null);

    useEffect(() => {
        if (videoUrl) {
            // Fetch existing annotations for the video
            axios.get(`http://localhost:5000/api/annotations/${encodeURIComponent(videoUrl)}`).then((response) => {
                setAnnotations(response.data);
            });
        }
    }, [videoUrl]);

    const handleAddAnnotation = () => {
        const currentTime = playerRef.current.getCurrentTime();
        const annotation = {
            videoUrl,
            timestamp: currentTime,
            comment,
            x: 0, // Add logic for setting position
            y: 0, // Add logic for setting position
        };
        setAnnotations([...annotations, annotation]);
        axios.post('http://localhost:5000/api/annotations', annotation);
        setComment('');
    };

    return (
        <div className="flex flex-col items-center p-8">
            <h1 className="text-3xl font-bold mb-6">Video Annotation Tool</h1>
            <input
                type="text"
                className="border rounded p-2 w-full max-w-md mb-4"
                placeholder="Enter video URL"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
            />
            {videoUrl && (
                <div className="w-full max-w-3xl">
                    <ReactPlayer ref={playerRef} url={videoUrl} controls width="100%" height="auto" />
                    <div className="mt-4 flex flex-col items-center">
                        <input
                            type="text"
                            className="border rounded p-2 w-full max-w-md mb-4"
                            placeholder="Enter comment"
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                        />
                        <button
                            onClick={handleAddAnnotation}
                            className="bg-blue-500 text-white rounded px-4 py-2 hover:bg-blue-700"
                        >
                            Add Annotation
                        </button>
                    </div>
                    <div className="mt-6 text-left">
                        <h3 className="text-xl font-semibold mb-4">Annotations:</h3>
                        <ul className="list-disc pl-5">
                            {annotations.map((annotation, index) => (
                                <li key={index} className="mb-2">
                                    <strong>Time: {annotation.timestamp.toFixed(2)}s</strong> - {annotation.comment}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}
        </div>
    );
}

export default App;
