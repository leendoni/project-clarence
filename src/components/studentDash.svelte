<script>
	import { onMount } from 'svelte';
	import { DataTable } from 'carbon-components-svelte';
	import { db } from '../firebaseConfig';
	import { collection, query, where, getDocs } from 'firebase/firestore';

	let studentData = null;

	const getCurrentUser = () => {
		const user = localStorage.getItem('currentUser');
		if (user) {
			return JSON.parse(user);
		}
		return null;
	};

	const fetchStudentDataByUsername = async (username) => {
		try {
			const studentCollection = collection(db, 'students');
			const q = query(studentCollection, where('username', '==', username));
			const querySnapshot = await getDocs(q);

			if (!querySnapshot.empty) {
				querySnapshot.forEach((doc) => {
					studentData = doc.data();
					console.log('Student data:', studentData);
					// You can further process or display studentData as needed
				});
			} else {
				console.log('No matching student found for username:', username);
			}
		} catch (error) {
			console.error('Error fetching student data:', error);
		}
	};

	onMount(() => {
		const currentUser = getCurrentUser();
		if (currentUser && currentUser.username) {
			fetchStudentDataByUsername(currentUser.username);
		} else {
			console.error('Current user or username not found in localStorage.');
		}
	});
</script>

<h1>Student Clearance Form</h1>

{#if studentData}
	<span>Student Name: {studentData.firstName} {studentData.lastName}</span>
	<br /><br />
	<DataTable
		zebra
		size="medium"
		headers={[
			{ key: 'deptName', value: 'Department' },
			{ key: 'deptStatus', value: 'Status' },
			{ key: 'deptDetail', value: 'Details' }
		]}
		rows={[
			{
				id: 'a',
				deptName: 'Library',
				deptStatus: studentData.librStatus ? 'Complete' : 'Incomplete',
				deptDetail: studentData.librDescription
			},
			{
				id: 'b',
				deptName: 'Alumni & Placement',
				deptStatus: studentData.alumStatus ? 'Complete' : 'Incomplete',
				deptDetail: studentData.alumDescription
			},
			{
				id: 'c',
				deptName: 'OSAS & POD',
				deptStatus: studentData.osasStatus ? 'Complete' : 'Incomplete',
				deptDetail: studentData.osasDescription
			},
			{
				id: 'd',
				deptName: 'Guidance Office',
				deptStatus: studentData.guidStatus ? 'Complete' : 'Incomplete',
				deptDetail: studentData.guidDescription
			},
			{
				id: 'e',
				deptName: 'Dean / Academic Head',
				deptStatus: studentData.deanStatus ? 'Complete' : 'Incomplete',
				deptDetail: studentData.deanDescription
			},
			{
				id: 'f',
				deptName: 'Finance Office',
				deptStatus: studentData.fincStatus ? 'Complete' : 'Incomplete',
				deptDetail: studentData.fincDescription
			},
			{
				id: 'g',
				deptName: 'Registry Office',
				deptStatus: studentData.regsStatus ? 'Complete' : 'Incomplete',
				deptDetail: studentData.regsDescription
			}
		]}
	/>
	<br /><br />
	<p>NOTE: Tampering with this digital clearance form is equivalent to a major offense.</p>
{:else}
	<p>Loading student data...</p>
{/if}
