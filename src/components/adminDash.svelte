<script>
	import { onMount } from 'svelte';
	import {
		Button,
		DataTable,
		FluidForm,
		Pagination,
		TextArea,
		TextInput,
		Toolbar,
		ToolbarContent,
		ToolbarMenu,
		ToolbarMenuItem,
		ToolbarSearch,
		Toggle
	} from 'carbon-components-svelte';
	import EditIcon from 'carbon-icons-svelte/lib/Edit.svelte';
	import FilterIcon from 'carbon-icons-svelte/lib/Filter.svelte';
	import Export from 'carbon-icons-svelte/lib/Export.svelte';
	import SaveIcon from 'carbon-icons-svelte/lib/Save.svelte';
	import { db } from '../firebaseConfig';
	import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
	import { exportCSV } from '../utils/csvUtils';
	import StudentUpload from './studentUpload.svelte';

	let rows = [];
	let pageSize = 5;
	let page = 1;
	let filteredRowIds = [];
	const now = new Date();
	const currentDateTime = now.toLocaleString();
	let isEditing = false;
	let selectedStudentId = '';
	let selectedStudentNumber = '';
	let selectedStudentName = '';
	let selectedStudentDescription = '';
	let currentUser = null;

	const userFields = {
		libr: { status: false, desc: '', label: "Librarian's Notes" },
		alum: { status: false, desc: '', label: "Alumni Coordinator's Notes" },
		osas: { status: false, desc: '', label: "Prefect of Discipline's Notes" },
		guid: { status: false, desc: '', label: "Guidance Counselor's Notes" },
		dean: { status: false, desc: '', label: "Dean / Academic Head's Notes" },
		finc: { status: false, desc: '', label: "Finance Officer's Notes" },
		regs: { status: false, desc: '', label: "Registrar's Notes" }
	};

	const convertToBoolean = (value) => {
		return value === true || value === 'true' || value === '1';
	};

	// Function to fetch student data from Firestore
	const fetchStudentData = async () => {
		const studentCollection = collection(db, 'students');
		const querySnapshot = await getDocs(studentCollection);
		rows = querySnapshot.docs.map((doc) => {
			const data = doc.data();
			return {
				id: doc.id,
				studNum: data.studentNumber,
				studNam: `${data.lastName}, ${data.firstName} ${data.middleName}`,
				studSta: data.studentStatus01,
				...Object.fromEntries(
					Object.keys(userFields).flatMap((key) => [
						[key + 'Desc', data[key + 'Description']],
						[key + 'Stat', convertToBoolean(data[key + 'Status'])]
					])
				),
				description: data.description || ''
			};
		});
	};

	// Function to retrieve currentUser from localStorage
	const getCurrentUser = () => {
		const user = localStorage.getItem('currentUser');
		if (user) {
			return JSON.parse(user);
		}
		return null;
	};

	onMount(async () => {
		await fetchStudentData();
		currentUser = getCurrentUser();
		console.log(currentUser.accountType);
		console.log(currentUser.librStat);
		console.log(currentUser.username);
	});

	// Function to export DataTable contents to CSV
	const handleExportCSV = () => {
		const csvData = rows.map((row) => ({
			'Student Number': row.studNum,
			'Student Name': row.studNam,
			Status: row.studSta
		}));
		exportCSV(csvData, 'student_data.csv');
	};

	const handleRowClick = (event) => {
		const selectedRowId = event.detail.id;
		const selectedRow = rows.find((row) => row.id === selectedRowId);

		if (selectedRow) {
			selectedStudentId = selectedRow.id;
			selectedStudentNumber = selectedRow.studNum;
			selectedStudentName = selectedRow.studNam;
			selectedStudentDescription = selectedRow.librDescription;
			Object.keys(userFields).forEach((key) => {
				userFields[key].desc = selectedRow[key + 'Desc'];
				userFields[key].status = selectedRow[key + 'Stat'];
			});
		}
	};

	const toggleEditing = () => {
		isEditing = !isEditing;
	};

	// Function to save the updated student data to Firestore
	const saveStudentData = async () => {
		if (!selectedStudentId) {
			alert('No student selected');
			return;
		}

		try {
			const studentDocRef = doc(db, 'students', selectedStudentId);

			// Initialize description with existing description
			let updatedDescription = selectedStudentDescription || '';

			// Prepare updates only for the current user type
			const userType = currentUser.accountType;
			const updateData = {
				studentNumber: selectedStudentNumber,
				studentName: selectedStudentName
			};

			// Concatenate all other descriptions to updatedDescription
			Object.keys(userFields).forEach((key) => {
				if (key !== userType && userFields[key].desc) {
					updatedDescription += `, ${userFields[key].desc}`;
				}
			});

			// Update the description field in updateData
			updateData.description = updatedDescription;

			// Add updates for the current user type
			updateData[`${userType}Description`] = userFields[userType].desc;
			updateData[`${userType}Status`] = userFields[userType].status;

			// Ensure all fields are defined in updateData
			Object.keys(updateData).forEach((key) => {
				if (updateData[key] === undefined) {
					delete updateData[key]; // Remove undefined fields
				}
			});

			await updateDoc(studentDocRef, updateData);

			alert('Student data updated successfully');
			await fetchStudentData(); // Refresh data after save
		} catch (error) {
			console.error('Error updating student data:', error);
			alert('Failed to update student data');
		} finally {
			isEditing = false;
		}
	};
</script>

{#if currentUser}
	<h1>Dashboard</h1>
	<span>updated as of {currentDateTime}</span>

	<br /><br /><br />

	<StudentUpload />

	<br /><br /><br />
	<DataTable
		zebra
		sortable
		headers={[
			{ key: 'studNum', value: 'Student Number' },
			{ key: 'studNam', value: 'Student Name' }
		]}
		{pageSize}
		{page}
		{rows}
		on:click:row={handleRowClick}
	>
		<Toolbar>
			<ToolbarContent>
				<ToolbarSearch persistent shouldFilterRows bind:filteredRowIds />
				<ToolbarMenu icon={FilterIcon}>
					<ToolbarMenuItem primaryFocus>All</ToolbarMenuItem>
					<ToolbarMenuItem hasDivider>Complete</ToolbarMenuItem>
					<ToolbarMenuItem>Incomplete</ToolbarMenuItem>
				</ToolbarMenu>
				<Button
					disabled={isEditing}
					kind="ghost"
					iconDescription="Edit"
					tooltipPosition="left"
					icon={EditIcon}
					on:click={toggleEditing}
				/>
				<Button
					disabled={!isEditing}
					kind="ghost"
					iconDescription="Save"
					tooltipPosition="left"
					icon={SaveIcon}
					on:click={saveStudentData}
				/>
				<Button
					kind="ghost"
					iconDescription="Export CSV"
					tooltipPosition="left"
					icon={Export}
					on:click={handleExportCSV}
				/>
			</ToolbarContent>
		</Toolbar>
	</DataTable>
	<Pagination bind:pageSize bind:page totalItems={rows.length} pageSizeInputDisabled />
	<br /><br /><br />

	{#if currentUser.accountType in userFields}
		<Toggle
			bind:toggled={userFields[currentUser.accountType].status}
			disabled={!isEditing}
			labelText="Student Status"
			labelA="Incomplete"
			labelB="Complete"
		/>
	{:else if currentUser.accountType == 'regs'}
		{#each Object.keys(userFields) as key}
			<Toggle
				bind:toggled={userFields[key].status}
				disabled
				labelText="Student Status"
				labelA="Incomplete"
				labelB="Complete"
			/>
		{/each}
	{:else}
		No user.
	{/if}

	<br />

	<FluidForm>
		<TextInput readonly={!isEditing} labelText="Student Number" value={selectedStudentNumber} />
		<TextInput readonly={!isEditing} labelText="Student Name" value={selectedStudentName} />
	</FluidForm>

	<br /><br />

	{#if currentUser.accountType in userFields}
		<TextArea
			readonly={!isEditing}
			labelText={userFields[currentUser.accountType].label}
			bind:value={userFields[currentUser.accountType].desc}
			maxCount={150}
		/>
	{:else if currentUser.accountType == 'regs'}
		{#each Object.keys(userFields) as key}
			<TextArea
				readonly={!isEditing}
				labelText={userFields[key].label}
				bind:value={userFields[key].desc}
				maxCount={150}
			/>
		{/each}
	{:else}
		No user.
	{/if}
{:else}
	No User.
{/if}
