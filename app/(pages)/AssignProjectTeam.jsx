import { View, Text, Dimensions, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useRoute, useNavigation } from "@react-navigation/native";
import { fetchStandardTaskByProjectTeam } from '../../src/services/standardTaskService';
import { fetchUserById } from '../../src/services/userService';
import { createTask } from '../../src/services/taskService';
import { fetchProjectTeamIdByUserId } from '../../src/services/projectTeamService';

const { width, height } = Dimensions.get("window");

const AssignProjectTeam = () => {
    const route = useRoute();
    const navigation = useNavigation();
    const { projectId, project_manager, project_supervisor, site_coordinator } = route.params;
    console.log('params', projectId, project_manager, project_supervisor, site_coordinator);

    const [projectManager, setProjectManager] = useState(null);
    const [projectSupervisor, setProjectSupervisor] = useState(null);
    const [siteCoordinator, setSiteCoordinator] = useState(null);
    const [projectManagerTasks, setProjectManagerTasks] = useState([]);
    const [projectSupervisorTasks, setProjectSupervisorTasks] = useState([]);
    const [siteCoordinatorTasks, setSiteCoordinatorTasks] = useState([]);
    const [projectManagerTeamId, setProjectManagerTeamId] = useState('');
    const [projectSupervisorTeamId, setProjectSupervisorTeamId] = useState('');
    const [siteCoordTeamId, setsiteCoordTeamId] = useState('');

    useEffect(() => {
        const fetchProjectTeamDetails = async () => {
            try {
                const managerResp = await fetchUserById(project_manager);
                // console.log('manager user details', managerResp);
                setProjectManager(managerResp);

                const supervisorResp = await fetchUserById(project_supervisor);
                // console.log('project_supervisor user details', supervisorResp);
                setProjectSupervisor(supervisorResp);

                const coordinatorResp = await fetchUserById(site_coordinator);
                // console.log('site_coordinator user details', coordinatorResp);
                setSiteCoordinator(coordinatorResp);
            } catch (error) {
                console.log('Cannot fetch project team details', error)
            }
        }
        const fetchStandardTasks = async () => {
            try {
                const managersResponse = await fetchStandardTaskByProjectTeam('Project Manager');
                // console.log('tasks resp', managersResponse.data);
                setProjectManagerTasks(managersResponse?.data);

                const supervisorsResponse = await fetchStandardTaskByProjectTeam('Project Supervisor');
                // console.log('Project Supervisor resp', supervisorsResponse.data);
                setProjectSupervisorTasks(supervisorsResponse?.data);

                const coordinatorsResponse = await fetchStandardTaskByProjectTeam('Site Coordinator');
                // console.log('coordinatorsResponse', coordinatorsResponse.data);
                setSiteCoordinatorTasks(coordinatorsResponse?.data);
            } catch (error) {
                console.error("Error fetching standard tasks:", error);
            }
        };
        const fetchProjectTeamId = async () => {
            const projectManagerResp = await fetchProjectTeamIdByUserId(project_manager);
            // console.log('projectManagerResp', projectManagerResp.data[0].id)
            setProjectManagerTeamId(projectManagerResp?.data[0]?.id)

            const projectSupervisorResp = await fetchProjectTeamIdByUserId(project_supervisor);
            console.log('projectSupervisorResp', projectSupervisorResp.data)
            setProjectSupervisorTeamId(projectSupervisorResp?.data[0]?.id)

            const siteCordResp = await fetchProjectTeamIdByUserId(site_coordinator);
            // console.log('siteCordResp', siteCordResp.data[0].id)
            setsiteCoordTeamId(siteCordResp?.data[0]?.id)
        }
        fetchProjectTeamId()
        fetchProjectTeamDetails();
        fetchStandardTasks();
    }, [])

    const handleAssignTasks = async () => {
        // Helper function to assign tasks to a specific team member
        const assignTasks = async (tasks, userId, approver) => {
            try {
                if (tasks.length > 0 && userId) {
                    await Promise.all(
                        tasks.map(async (task) => {
                            const payload = {
                                data: {
                                    project_team_member: userId,
                                    project: projectId,
                                    standard_task: task.id,
                                    submissions: [],
                                    documents: [],
                                    task_status: "ongoing",
                                    approver: projectSupervisorTeamId,
                                }
                            };
                            console.log('Payload:', payload);
                            await createTask(payload);
                        })
                    );
                }
            } catch (error) {
                console.error(`Error assigning tasks for user ${userId}:`, error);
                throw error;
            }
        };

        try {
            // Assign tasks to Project Manager
            await assignTasks(projectManagerTasks, project_manager, projectSupervisorTeamId);

            // Assign tasks to Project Supervisor
            await assignTasks(projectSupervisorTasks, project_supervisor, projectSupervisorTeamId);

            // Assign tasks to Site Coordinator
            await assignTasks(siteCoordinatorTasks, site_coordinator, projectSupervisorTeamId);

            alert("Tasks have been successfully assigned to the project team!");

            navigation.navigate("(pages)/AssignContractors", {
                projectId: projectId,
            });
        } catch (error) {
            console.error("Error assigning tasks:", error);
            alert("Failed to assign tasks. Please try again.");
        }
    };

    return (
        <SafeAreaView style={styles.AreaContainer}>
            <ScrollView>
                <View style={styles.container}>
                    <View style={styles.header}>
                        <Text style={styles.headerText}>Assign Tasks to Project Team</Text>
                    </View>

                    <View style={styles.taskBlock}>
                        <View style={styles.section}>
                            {projectManager ? (
                                <Text style={styles.detailText}>
                                    Project Manager: {projectManager.username}
                                    {/* ({projectManager.email}) */}
                                </Text>
                            ) : (
                                <Text style={styles.loadingText}>Loading Project Manager details...</Text>
                            )}
                        </View>
                        <View style={styles.section}>
                            <Text style={styles.subHeaderText}>Tasks:</Text>
                            {projectManagerTasks.length > 0 ? (
                                projectManagerTasks.map((task, index) => (
                                    <Text key={index} style={styles.taskText}>
                                        - {task.attributes.Name}
                                    </Text>
                                ))
                            ) : (
                                <Text style={styles.loadingText}>Loading tasks...</Text>
                            )}
                        </View>
                    </View>

                    <View style={styles.taskBlock}>
                        <View style={styles.section}>
                            {projectSupervisor ? (
                                <Text style={styles.detailText}>
                                    Project Supervisor: {projectSupervisor.username}
                                    {/* ({projectSupervisor.email}) */}
                                </Text>
                            ) : (
                                <Text style={styles.loadingText}>Loading Project Supervisor details...</Text>
                            )}
                        </View>
                        <View style={styles.section}>
                            <Text style={styles.subHeaderText}>Tasks:</Text>
                            {projectSupervisorTasks.length > 0 ? (
                                projectSupervisorTasks.map((task, index) => (
                                    <Text key={index} style={styles.taskText}>
                                        - {task.attributes.Name}
                                    </Text>
                                ))
                            ) : (
                                <Text style={styles.loadingText}>Loading tasks...</Text>
                            )}
                        </View>
                    </View>

                    <View style={styles.taskBlock}>
                        <View style={styles.section}>
                            {siteCoordinator ? (
                                <Text style={styles.detailText}>
                                    Site Coordinator: {siteCoordinator.username}
                                    {/* ({siteCoordinator.email}) */}
                                </Text>
                            ) : (
                                <Text style={styles.loadingText}>Loading Site Coordinator details...</Text>
                            )}
                        </View>
                        <View style={styles.section}>
                            <Text style={styles.subHeaderText}>Tasks:</Text>
                            {siteCoordinatorTasks.length > 0 ? (
                                siteCoordinatorTasks.map((task, index) => (
                                    <Text key={index} style={styles.taskText}>
                                        - {task.attributes.Name}
                                    </Text>
                                ))
                            ) : (
                                <Text style={styles.loadingText}>Loading tasks...</Text>
                            )}
                        </View>
                    </View>

                    <View style={styles.buttonContainer}>
                        <TouchableOpacity style={styles.finishButton} onPress={handleAssignTasks}>
                            <Text style={styles.finishButtonText}>Assign Tasks</Text>
                        </TouchableOpacity>
                    </View>

                </View>
            </ScrollView>
        </SafeAreaView>
    )
};

export default AssignProjectTeam

const styles = StyleSheet.create({
    AreaContainer: {
        flex: 1,
        padding: 5,
        marginTop: 20,
        width: "100%",
    },
    container: {
        flex: 1,
        padding: 20,
    },
    mainHeading: {
        fontSize: 24,
        fontWeight: "bold",
        textAlign: "left",
        marginBottom: 20,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 20,
    },
    headerText: {
        fontSize: width * 0.06,
        fontWeight: "600",
        color: "#1C1C1E",
        marginLeft: 20,
    },
    taskBlock: {
        marginTop: 10,
        padding: 10,
        backgroundColor: "#fff",
        borderRadius: 5,
    },
    section: {
        // backgroundColor: 'lightgreen',
    },
    detailText: {
        fontSize: 20,
        marginBottom: 10
    },
    subHeaderText: {
        fontSize: 18,
    },
    taskText: {
        fontSize: 16,
    },
    buttonContainer: {
        position: "relative",
        alignItems: "center",
        marginTop: 20,
    },
    finishButton: {
        marginTop: 20,
        width: "60%",
        alignSelf: "center",
        backgroundColor: "#4a90e2",
        padding: 15,
        borderRadius: 15,
        alignItems: "center",
        cursor: "pointer",
    },
    finishButtonText: {
        color: "#fff",
        fontSize: 20,
        fontWeight: "bold",
    },
});