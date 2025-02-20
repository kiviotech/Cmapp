import React ,{useState,useEffect}from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { icons } from '../../../../constants';
import TaskCard from './TaskCard'; 
import { fetchProjectByUserId } from '../../../../src/services/userService';
import useAuthStore from '../../../../useAuthStore';

const ProjectOverview = () => {

    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);
    const user = useAuthStore((state) => state.user);
    const userId = user?.id;

    useEffect(() => {
        const getProjectDetails = async () => {
            try {
                const projectData = await fetchProjectByUserId(userId);
                setProject(projectData.project);
            } catch (error) {
                console.error("Error fetching project details:", error);
            } finally {
                setLoading(false);
            }
        };

        getProjectDetails();
    }, [userId]);

   
    const completedTasks = project?.tasks && project.tasks.length > 0
    ? project.tasks.filter(task => {
        const status = task.task_status?.trim(); // Ensure exact match
        return status && status.toLowerCase() === 'completed'; // Case insensitive check
    })
    : [];







    return (
        <View style={styles.container}>
            {/* Project Name */}
            <View style={styles.row}>
                <Text style={styles.label}>Project Name:</Text>
                <Text style={styles.value}>{project?.name || 'N/A'}</Text>
            </View>

            {/* Start Date */}
            <View style={[styles.row, styles.iconRow]}>
                <Image source={icons.Group1} style={styles.icon} />
                <Text style={styles.label}>Start date:</Text>
                <Text style={styles.value}> {project?.start_date ? new Date(project.start_date).toLocaleDateString() : 'N/A'}</Text>
            </View>

            {/* Project Manager */}
            <View style={styles.row}>
                <Text style={styles.label}>Project Manager :</Text>
                <Text style={styles.value}>Project Manager Name</Text>
            </View>

            {/* Project Details */}
            <View style={styles.projectDetails}>
                <Text style={styles.label}>Project details:</Text>
                <Text style={styles.description}> {project?.description || 'No description available'}</Text>
            </View>

            {/* Completed Tasks Heading */}
            <Text style={styles.sectionHeading}>Completed Tasks</Text>

            {/* Mapping TaskCard */}
            {completedTasks.map(task => (
                <TaskCard 
                    key={task.id}
                    taskName={task.standard_task.Name} 
                    contractorName={task.contractor[0]?.username || 'Unknown Contractor'}
                    date={new Date(task.updatedAt).toLocaleDateString() || 'No date'}
                    status={task.task_status}
                />
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
        width:"100%"
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    iconRow: {
        flexDirection: 'row',
    },
    label: {
        fontSize: 16,
        fontWeight: '400',
        color: '#B0B0B0',
        marginRight: 5,
    },
    value: {
        fontSize: 16,
        fontWeight: '400',
        color: '#000',
    },
    icon: {
        width: 18,
        height: 18,
        marginRight: 5,
    },
    projectDetails: {
        marginTop: 5,
        marginBottom: 20,
    },
    description: {
        fontSize: 14,
        color: '#000',
        lineHeight: 20,
    },
    sectionHeading: {
        fontSize: 22,
        fontWeight: '400',
        color: '#000',
        marginBottom: 10,
    },
});

export default ProjectOverview;
