import React,{useState, useEffect} from "react";
import { View, Text, ScrollView, StyleSheet, Dimensions } from "react-native";
import Svg, { Line, Circle, Text as SvgText } from "react-native-svg";
import useAuthStore from "../../../../useAuthStore";
import {fetchStages} from "../../../../src/services/stageService"
import { fetchTasksByUserId } from "../../../../src/services/userService";

// const steps = [
//   { id: 1, title: "Substructure", items: [{ name: "Dirt Work", completed: true }, { name: "Foundation", completed: true }], completed: true },
//   { id: 2, title: "Superstructure", items: [{ name: "Framing", completed: true }, { name: "Sheathing", completed: true }], completed: true },
//   { id: 3, title: "Exterior Finishes", items: [{ name: "Roofing", completed: true }, { name: "Windows", completed: true }, { name: "Smart Facade", completed: true }, { name: "Doors & Openings Installation", completed: true }, { name: "Other Exterior Finishes", completed: true }], completed: true },
//   { id: 4, title: "Interior Finishes", items: [{ name: "Insulation (Open Cell Spray Foam)", completed: false }, { name: "Drywall", completed: false }, { name: "Painting", completed: false }, { name: "Cabinets", completed: false }, { name: "Floor & Wall Finishing", completed: false }, { name: "Interior Doors", completed: false }, { name: "Staircase", completed: false }, { name: "Appliances", completed: false }, { name: "Other Interior Finishes", completed: false }], completed: false },
//   { id: 5, title: "MEP", items: [{ name: "Plumbing", completed: false }, { name: "Electrical", completed: false }, { name: "HVAC", completed: false }], completed: false },
//   { id: 6, title: "Landscape", items: [{ name: "Hardscape", completed: false }, { name: "Softscape", completed: false }], completed: false },
  
  
// ];

const { width } = Dimensions.get("window");
const circleX = width * 0.5; 
const textXLeft = width * 0.1; 
const textXRight = width * 0.6; 



const ProjectTracking = () => {
  const [steps, setSteps] = useState([]);
  const [tasks, setTasks] = useState([]);
  const user = useAuthStore((state) => state.user);
    const userId = user?.id;


  useEffect(() => {
    const loadStages = async () => {
      try {
        const stages = await fetchStages();
        // console.log(stages.data.map(stage => stage.attributes.name)); // Logging only the titles

        const formattedSteps = stages.data.map((stage, index) => ({
          id: index + 1,
          title: stage.attributes.name, // Only fetching the title
          items: [], // Keeping items empty since backend provides default values
          completed: false, // Default value
        }));

        setSteps(formattedSteps);
      } catch (error) {
        console.error("Error fetching stages:", error);
      }
    };

    loadStages();
  }, []);



  useEffect(() => {
    const loadItems = async () => {
      try {
        const items = await fetchTasksByUserId(userId); // Pass the userId to the function
        console.log(items.project.tasks[0].standard_task); // Log the fetched tasks
        setTasks(items); // Optionally, you can update the state with the fetched tasks
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };

    loadItems();
  }, [userId]);



// Calculate dynamic heights
const stepHeights = steps.map(step => 50 + step.items.length * 20);
const totalHeight = stepHeights.reduce((acc, height) => acc + height, 0);


  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Svg height={totalHeight + 50} width={width}>
        {steps.map((step, index) => {
          const yOffset = stepHeights.slice(0, index).reduce((acc, h) => acc + h, 30);

          // Determine if the step is completed (all items should be completed)
          const stepCompleted = step.items.every(item => item.completed);

          return (
            <React.Fragment key={step.id}>
              {/* Line connecting steps */}
              {index !== steps.length - 1 && (
                <Line
                  x1={circleX}
                  y1={yOffset}
                  x2={circleX}
                  y2={yOffset + stepHeights[index]}
                  stroke={stepCompleted ? "#007AFF" : "#C0C0C0"}
                  strokeWidth="3"
                />
              )}

              {/* Always add line for the last step */}
              {index === steps.length - 1 && (
                <Line
                  x1={circleX}
                  y1={yOffset - stepHeights[index]} 
                  x2={circleX}
                  y2={yOffset + stepHeights[index] + 20}
                  stroke={stepCompleted ? "#007AFF" : "#C0C0C0"}
                  strokeWidth="3"
                />
              )}

              {/* Main Step Circle */}
              <Circle
                cx={circleX}
                cy={yOffset}
                r="14"
                fill={stepCompleted ? "#007AFF" : "#C0C0C0"}
                stroke="white"
                strokeWidth="2"
              />
              <SvgText
                x={circleX}
                y={yOffset + 5}
                fontSize="12"
                fontWeight="bold"
                fill="white"
                textAnchor="middle"
              >
                {step.id}
              </SvgText>

              {/* Small circles for each item inside the step */}
              {step.items.map((item, itemIndex) => {
                const itemYOffset = yOffset + 25 + itemIndex * 20;
                return (
                  <Circle
                    key={`${step.id}-item-${itemIndex}`}
                    cx={circleX}
                    cy={itemYOffset}
                    r="5"
                    fill={item.completed ? "#007AFF" : "#C0C0C0"}
                  />
                );
              })}
            </React.Fragment>
          );
        })}
      </Svg>

      {/* Step text alignment beside circles */}
      <View style={styles.textContainer}>
        {steps.map((step, index) => {
          const yOffset = stepHeights.slice(0, index).reduce((acc, h) => acc + h, 30);
          const textX = index % 2 === 0 ? textXLeft : textXRight; // Alternate text positioning

          return (
            <View
              key={step.id}
              style={[styles.step, { top: yOffset - 10, left: textX }]}>
              <Text style={styles.stepTitle}>{step.title}</Text>
              {step.items.map((item, i) => (
                <Text key={i} style={styles.stepItem}>— {item.name}</Text>
              ))}
            </View>
          );
        })}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    paddingVertical: 20,
    alignItems: "center",
    width: "100%",
    paddingHorizontal: 10
  },
  textContainer: {
    position: "absolute",
    width: "100%",
    paddingTop: 10,
  },
  step: {
    position: "absolute",
    width: "100%",
  },
  stepTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  stepItem: {
    fontSize: 14,
    color: "#666",
    flexWrap: 'wrap',
    maxWidth: width * 0.4, // Limit text width for proper wrapping
  },
});

export default ProjectTracking;


