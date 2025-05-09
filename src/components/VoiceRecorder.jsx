import { Button } from "@heroui/button";
import { Card } from "@heroui/card";
import { Mic, Send, StopCircle, Trash } from "lucide-react";
import { useState, useRef } from "react";

const VoiceRecorder = ({ onSend }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [audioData, setAudioData] = useState([]);
  const mediaRecorderRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const dataArrayRef = useRef(null);
  const animationFrameRef = useRef(null);
  const chunksRef = useRef([]);
  const streamRef = useRef(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: "audio/webm;codecs=opus",
      });

      mediaRecorderRef.current = mediaRecorder;

      chunksRef.current = [];
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        setAudioBlob(blob);
        chunksRef.current = [];
      };

      const audioContext = new (window.AudioContext ||
        window.webkitAudioContext)();
      const source = audioContext.createMediaStreamSource(stream);
      const analyser = audioContext.createAnalyser();
      source.connect(analyser);

      analyser.fftSize = 64;
      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      audioContextRef.current = audioContext;
      analyserRef.current = analyser;
      dataArrayRef.current = dataArray;

      const drawVisualizer = () => {
        analyser.getByteFrequencyData(dataArray);
        setAudioData([...dataArray]);
        animationFrameRef.current = requestAnimationFrame(drawVisualizer);
      };

      drawVisualizer();
      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error("Mic access error:", error);
    }
  };

 const stopRecording = () => {
  if (mediaRecorderRef.current?.state === "recording") {
    mediaRecorderRef.current.stop();
  }

  setIsRecording(false);
  cancelAnimationFrame(animationFrameRef.current);

  if (audioContextRef.current) {
    audioContextRef.current.close();
  }

  if (streamRef.current) {
    streamRef.current.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
  }
};


  const resetRecording = () => {
    setAudioBlob(null);
    setAudioData([]);
  };

  const sendAudio = () => {
    if (audioBlob && onSend) {
      onSend(audioBlob);
      resetRecording();
    }
  };

  return (
    <Card className="flex-row gap-3 p-3 w-full max-w-full">
      <div className="w-full h-10 flex items-end gap-[1px] overflow-hidden">
        {audioData.map((value, index) => (
          <div
            key={index}
            className="flex-1 rounded-sm max-h-full bg-limegreen"
            style={{
              height: `${value / 5}px`,
              width: `2px`,
            }}
          />
        ))}
      </div>
      <div className="flex justify-center gap-2">
        {isRecording ? (
          <Button
            isIconOnly
            onPress={stopRecording}
            className="bg-red-500"
            startContent={<StopCircle />}
          />
        ) : audioBlob ? (
          <>
            <Button
              isIconOnly
              className="bg-gray-300 text-black"
              onPress={resetRecording}
              startContent={<Trash />}
            />
            <Button
              isIconOnly
              className="bg-limegreen text-black"
              onPress={sendAudio}
              startContent={<Send />}
            />
          </>
        ) : (
          <Button
            isIconOnly
            onPress={startRecording}
            className="bg-limegreen text-black"
            startContent={<Mic />}
          />
        )}
      </div>
    </Card>
  );
};

export default VoiceRecorder;
