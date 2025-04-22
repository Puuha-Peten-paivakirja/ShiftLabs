import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Path } from 'react-native-svg';

// Function to calculate the arc (a section of the circle)
const createArc = (cx, cy, r, startAngle, endAngle) => {
  const x1 = cx + r * Math.cos(startAngle);
  const y1 = cy + r * Math.sin(startAngle);
  const x2 = cx + r * Math.cos(endAngle);
  const y2 = cy + r * Math.sin(endAngle);
  const largeArcFlag = endAngle - startAngle <= Math.PI ? '0' : '1';

  return `M${cx},${cy} L${x1},${y1} A${r},${r} 0 ${largeArcFlag} 1 ${x2},${y2} Z`;
};

// Function to generate a random color (you can also define specific colors)
const generateRandomColor = (index) => {
  const colors = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0','#9966FF', '#FF9F40', '#8B0000', '#3CB371', '#FFD700'];
  return colors[index % colors.length]; // Repeats the color if more than the length of the color array
};

const CircularSegments = ({ data }) => {
  // Filter out null, undefined, or NaN hours
  const validData = data.filter(item => item.hours != null && !isNaN(item.hours) && item.hours > 0);

  // If all data points have null, undefined, or invalid hours, render a full circle
  if (validData.length === 0) {
    return (
      <View style={{ alignItems: 'center', justifyContent: 'center' }}>
        <Svg width="200" height="200" viewBox="-125 -125 250 250">
          <Path
            d={`M0,-100 A100,100 0 1,1 0,100 A100,100 0 1,1 0,-100 Z`} // Full circle path
            fill="none"
            stroke="lightgray"
            strokeWidth={10}
          />
        </Svg>
        <Text>Ryhmällä ei ole vielä luotuja työtunteja</Text>
      </View>
    );
  }

  // Calculate the total hours from valid data
  const totalHours = validData.reduce((sum, item) => sum + item.hours, 0);
  let startAngle = -Math.PI / 2; // Start at the top of the circle (12 o'clock)
  const radius = 100; // Circle radius
  const innerRadius = 60;

  return (
    <View style={{ alignItems: 'center', justifyContent: 'center' }}>
      <Svg width="200" height="200" viewBox="-125 -125 250 250">
        {validData.map((item, index) => {
          const endAngle = startAngle + (item.hours / totalHours) * 2 * Math.PI;
          const path = createArc(0, 0, radius, startAngle, endAngle);

          startAngle = endAngle; // Update start angle for the next segment

          const segmentColor = item.color || generateRandomColor(index); // Assign a random color if not provided

          return (
            <React.Fragment key={index}>
              <Path
                d={path}
                fill={segmentColor}
                stroke='none'
              />
            </React.Fragment>
          );
        })}
        <Path
          d={`M0,${-innerRadius} A${innerRadius},${innerRadius} 0 1,1 0,${innerRadius} A${innerRadius},${innerRadius} 0 1,1 0,${-innerRadius} Z`} 
          fill="white" // Make it white to create the hollow effect
          stroke='none'
        />
      </Svg>

      {/* Display the labels below the circle */}
      <View style={styles.labelsContainer}>
        {/* Split the labels into two rows */}
        <View style={styles.row}>
          {validData.slice(0, Math.ceil(validData.length / 2)).map((item, index) => {
            const segmentColor = item.color || generateRandomColor(index); // Get the same color for the label
            return (
              <Text key={index} style={[styles.label, { color: segmentColor }]}>
                {item.firstName} - {item.hours} hrs
              </Text>
            );
          })}
        </View>
        <View style={styles.row}>
          {validData.slice(Math.ceil(validData.length / 2)).map((item, index) => {
            const segmentColor = item.color || generateRandomColor(index  + Math.ceil(validData.length / 2)); // Get the same color for the label
            return (
              <Text key={index} style={[styles.label, { color: segmentColor }]}>
                {item.firstName} - {item.hours} hrs
              </Text>
            );
          })}
        </View>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
    labelsContainer: {
      marginTop: 20,  // Adjust this margin to control the space between the circle and labels
      width: '100%',
      justifyContent: 'center',
      alignItems: 'center',
    },
    row: {
      flexDirection: 'row',  // Display labels in a row
      justifyContent: 'center',  // Distribute them evenly in the row
      marginBottom: 5,  // Add space between rows
    },
    label: {
      fontWeight: 'bold',
      fontSize: 14,
      color: 'black',
      paddingHorizontal: 10,  // Add space between labels horizontally
    },
  });
  
export default CircularSegments;