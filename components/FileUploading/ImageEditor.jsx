import React, { useState, useEffect, useRef } from "react";
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  Platform,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";

const ImageEditor = ({ imageUri, onSave, onCancel }) => {
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [saturation, setSaturation] = useState(100);
  const [selectedColor, setSelectedColor] = useState("#FF0000");
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawingContext, setDrawingContext] = useState(null);
  const canvasRef = React.useRef(null);
  const [imageDimensions, setImageDimensions] = useState({
    width: 0,
    height: 0,
  });
  const [currentTool, setCurrentTool] = useState("brush");
  const [baseImage, setBaseImage] = useState(null);
  const [paths, setPaths] = useState([]);
  const currentPath = useRef({ points: [] });

  const colors = [
    "#FF0000", // Red
    "#00FF00", // Green
    "#0000FF", // Blue
    "#FFFF00", // Yellow
    "#FF00FF", // Magenta
    "#00FFFF", // Cyan
    "#000000", // Black
    "#FFFFFF", // White
  ];

  useEffect(() => {
    if (Platform.OS === "web") {
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext("2d");
        const img = new window.Image();

        img.onload = () => {
          const containerWidth = canvas.parentElement.clientWidth;
          const scale = containerWidth / img.width;
          const scaledHeight = img.height * scale;

          canvas.width = containerWidth;
          canvas.height = scaledHeight;

          setImageDimensions({ width: containerWidth, height: scaledHeight });

          ctx.drawImage(img, 0, 0, containerWidth, scaledHeight);
          setBaseImage(ctx.getImageData(0, 0, containerWidth, scaledHeight));
          setDrawingContext(ctx);
        };

        img.src = imageUri;
      }
    }
  }, [imageUri]);

  const startDrawing = (e) => {
    if (!drawingContext) return;
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;

    if (currentTool === "eraser") {
      // Split paths at eraser point instead of just removing points
      const eraserRadius = 15;
      const newPaths = [];

      paths.forEach((path) => {
        let currentSegment = [];
        let segmentStarted = false;

        path.points.forEach((point, index) => {
          const distance = Math.sqrt(
            Math.pow(x - point.x, 2) + Math.pow(y - point.y, 2)
          );

          if (distance > eraserRadius) {
            currentSegment.push(point);
            segmentStarted = true;
          } else if (segmentStarted && currentSegment.length > 0) {
            // End current segment and start a new one
            if (currentSegment.length > 1) {
              newPaths.push({
                ...path,
                points: [...currentSegment],
              });
            }
            currentSegment = [];
            segmentStarted = false;
          }
        });

        // Add the last segment if it exists
        if (currentSegment.length > 1) {
          newPaths.push({
            ...path,
            points: [...currentSegment],
          });
        }
      });

      setPaths(newPaths);
      redrawCanvas();
    } else {
      setIsDrawing(true);
      currentPath.current = {
        points: [{ x, y }],
        color: selectedColor,
        lineWidth: 5,
      };

      drawingContext.beginPath();
      drawingContext.moveTo(x, y);
      drawingContext.strokeStyle = selectedColor;
      drawingContext.lineWidth = 5;
      drawingContext.lineCap = "round";
    }
  };

  const draw = (e) => {
    if (!isDrawing || !drawingContext || currentTool === "eraser") return;
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;

    currentPath.current.points.push({ x, y });

    drawingContext.lineTo(x, y);
    drawingContext.stroke();
  };

  const stopDrawing = () => {
    if (!drawingContext) return;
    setIsDrawing(false);
    drawingContext.closePath();

    if (currentPath.current && currentTool === "brush") {
      setPaths([...paths, { ...currentPath.current }]);
      currentPath.current = { points: [] };
    }
  };

  const redrawCanvas = () => {
    if (!drawingContext || !baseImage) return;

    // Clear canvas and draw base image
    drawingContext.putImageData(baseImage, 0, 0);

    // Redraw all paths
    paths.forEach((path) => {
      if (path.points.length < 2) return;

      drawingContext.beginPath();
      drawingContext.strokeStyle = path.color;
      drawingContext.lineWidth = path.lineWidth;
      drawingContext.lineCap = "round";
      drawingContext.lineJoin = "round";

      // Draw using bezier curves for smoother lines
      drawingContext.moveTo(path.points[0].x, path.points[0].y);

      if (path.points.length === 2) {
        // For very short paths, just draw a line
        drawingContext.lineTo(path.points[1].x, path.points[1].y);
      } else {
        // Use bezier curves for smoother lines
        for (let i = 1; i < path.points.length - 2; i++) {
          const c = (path.points[i].x + path.points[i + 1].x) / 2;
          const d = (path.points[i].y + path.points[i + 1].y) / 2;

          drawingContext.quadraticCurveTo(
            path.points[i].x,
            path.points[i].y,
            c,
            d
          );
        }

        // For the last two points
        drawingContext.quadraticCurveTo(
          path.points[path.points.length - 2].x,
          path.points[path.points.length - 2].y,
          path.points[path.points.length - 1].x,
          path.points[path.points.length - 1].y
        );
      }

      drawingContext.stroke();
    });
  };

  useEffect(() => {
    redrawCanvas();
  }, [paths]);

  const applyEdits = () => {
    if (Platform.OS === "web" && canvasRef.current) {
      const canvas = canvasRef.current;

      // Create final canvas with filters applied
      const finalCanvas = document.createElement("canvas");
      finalCanvas.width = canvas.width;
      finalCanvas.height = canvas.height;
      const finalCtx = finalCanvas.getContext("2d");

      // Apply filters to final canvas
      finalCtx.filter = `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%)`;
      finalCtx.drawImage(canvas, 0, 0);

      // Convert to blob and save
      finalCanvas.toBlob(
        (blob) => {
          onSave(URL.createObjectURL(blob));
        },
        "image/jpeg",
        0.95
      );
    }
  };

  const applyFilters = () => {
    if (!drawingContext || !baseImage) return;

    // Create a temporary canvas for filter operations
    const tempCanvas = document.createElement("canvas");
    tempCanvas.width = canvasRef.current.width;
    tempCanvas.height = canvasRef.current.height;
    const tempCtx = tempCanvas.getContext("2d");

    // Clear temp canvas
    tempCtx.clearRect(0, 0, tempCanvas.width, tempCanvas.height);

    // Draw base image to temp canvas
    tempCtx.putImageData(baseImage, 0, 0);

    // Clear main canvas
    drawingContext.clearRect(
      0,
      0,
      canvasRef.current.width,
      canvasRef.current.height
    );

    // Apply filters
    drawingContext.filter = `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%)`;

    // Draw filtered image from temp canvas to main canvas
    drawingContext.drawImage(tempCanvas, 0, 0);

    // Reset filter
    drawingContext.filter = "none";

    // Redraw paths on top
    paths.forEach((path) => {
      if (path.points.length < 2) return;

      drawingContext.beginPath();
      drawingContext.strokeStyle = path.color;
      drawingContext.lineWidth = path.lineWidth;
      drawingContext.lineCap = "round";
      drawingContext.lineJoin = "round";

      drawingContext.moveTo(path.points[0].x, path.points[0].y);

      if (path.points.length === 2) {
        drawingContext.lineTo(path.points[1].x, path.points[1].y);
      } else {
        for (let i = 1; i < path.points.length - 2; i++) {
          const c = (path.points[i].x + path.points[i + 1].x) / 2;
          const d = (path.points[i].y + path.points[i + 1].y) / 2;

          drawingContext.quadraticCurveTo(
            path.points[i].x,
            path.points[i].y,
            c,
            d
          );
        }

        drawingContext.quadraticCurveTo(
          path.points[path.points.length - 2].x,
          path.points[path.points.length - 2].y,
          path.points[path.points.length - 1].x,
          path.points[path.points.length - 1].y
        );
      }

      drawingContext.stroke();
    });
  };

  // Update the useEffect to debounce filter changes for better performance
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      applyFilters();
    }, 10); // Small delay to prevent too frequent updates

    return () => clearTimeout(timeoutId);
  }, [brightness, contrast, saturation]);

  const CustomSlider = ({ value, onChange, label }) => (
    <View style={styles.sliderContainer}>
      <Text style={styles.label}>{label}</Text>
      <input
        type="range"
        min="0"
        max="200"
        value={value}
        onChange={(e) => {
          const newValue = Number(e.target.value);
          onChange(newValue);
        }}
        style={{
          width: "100%",
          height: 40,
        }}
      />
      <Text style={styles.value}>{value}%</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {Platform.OS === "web" ? (
        <canvas
          ref={canvasRef}
          style={styles.canvas}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseOut={stopDrawing}
        />
      ) : (
        <View style={styles.canvas} />
      )}

      <View style={styles.controls}>
        <View style={styles.toolsContainer}>
          <TouchableOpacity
            style={[
              styles.toolButton,
              currentTool === "brush" && styles.selectedTool,
            ]}
            onPress={() => setCurrentTool("brush")}
          >
            <FontAwesome
              name="paint-brush"
              size={20}
              color={currentTool === "brush" ? "#FFFFFF" : "#4B5563"}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.toolButton,
              currentTool === "eraser" && styles.selectedTool,
            ]}
            onPress={() => setCurrentTool("eraser")}
          >
            <FontAwesome
              name="eraser"
              size={20}
              color={currentTool === "eraser" ? "#FFFFFF" : "#4B5563"}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.colorPicker}>
          <Text style={styles.label}>Drawing Color</Text>
          <View style={styles.colorGrid}>
            {colors.map((color) => (
              <TouchableOpacity
                key={color}
                style={[
                  styles.colorOption,
                  { backgroundColor: color },
                  selectedColor === color && styles.selectedColor,
                ]}
                onPress={() => setSelectedColor(color)}
              />
            ))}
          </View>
        </View>

        <CustomSlider
          value={brightness}
          onChange={setBrightness}
          label="Brightness"
        />
        <CustomSlider
          value={contrast}
          onChange={setContrast}
          label="Contrast"
        />
        <CustomSlider
          value={saturation}
          onChange={setSaturation}
          label="Saturation"
        />

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, styles.cancelButton]}
            onPress={onCancel}
          >
            <Text style={styles.buttonText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={applyEdits}>
            <Text style={styles.buttonText}>Save</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F1F1F1",
    padding: 16,
  },
  canvas: {
    width: "100%",
    height: "auto",
    marginBottom: 20,
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
  },
  controls: {
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 10,
  },
  colorPicker: {
    marginBottom: 16,
  },
  colorGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 8,
  },
  colorOption: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: "#E5E7EB",
  },
  selectedColor: {
    borderColor: "#3B82F6",
    borderWidth: 3,
  },
  sliderContainer: {
    marginBottom: 16,
  },
  label: {
    marginBottom: 8,
    color: "#4B5563",
    fontWeight: "500",
  },
  value: {
    color: "#6B7280",
    textAlign: "right",
    marginTop: 4,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  button: {
    backgroundColor: "#3B82F6",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    flex: 1,
    marginHorizontal: 5,
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "#FF3B30",
  },
  buttonText: {
    color: "#FFF",
    fontWeight: "600",
  },
  toolsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 10,
    marginBottom: 16,
  },
  toolButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F3F4F6",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#E5E7EB",
  },
  selectedTool: {
    backgroundColor: "#3B82F6",
    borderColor: "#2563EB",
  },
});

export default ImageEditor;
