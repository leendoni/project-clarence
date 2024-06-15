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
	import { exportCSV } from '../utils/csvUtils'; // Import your CSV export utility function

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
	let updatedStudentStatus01 = false,
		updatedStudentStatus02 = false,
		updatedStudentStatus03 = false,
		updatedStudentStatus04 = false,
		updatedStudentStatus05 = false,
		updatedStudentStatus06 = false,
		updatedStudentStatus07 = false;

	// Function to fetch student data from Firestore
	const fetchStudentData = async () => {
		const studentCollection = collection(db, 'students'); // Replace 'students' with your Firestore collection name
		const querySnapshot = await getDocs(studentCollection);
		rows = querySnapshot.docs.map((doc) => ({
			id: doc.id,
			studNum: doc.data().studentNumber,
			studNam: `${doc.data().lastName}, ${doc.data().firstName} ${doc.data().middleName}`,
			studSta: doc.data().studentStatus01,
			description: doc.data().description || '' // Assuming description is a field in your document
		}));
	};

	onMount(async () => {
		await fetchStudentData();
	});

	// Function to export DataTable contents to CSV
	const handleExportCSV = () => {
		const csvData = rows.map((row) => ({
			'Student Number': row.studNum,
			'Student Name': row.studNam,
			Status: row.studSta
		}));

		// Utilize a utility function for exporting CSV data
		exportCSV(csvData, 'student_data.csv');
	};

	const handleRowClick = (event) => {
		const selectedRowId = event.detail.id;
		const selectedRow = rows.find((row) => row.id === selectedRowId);

		if (selectedRow) {
			selectedStudentId = selectedRow.id;
			selectedStudentNumber = selectedRow.studNum;
			selectedStudentName = selectedRow.studNam;
			selectedStudentDescription = selectedRow.description;
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

			const updateData = {
				studentNumber: selectedStudentNumber,
				studentName: selectedStudentName,
				description: selectedStudentDescription,
				studentStatus01: updatedStudentStatus01,
				studentStatus02: updatedStudentStatus02,
				studentStatus03: updatedStudentStatus03,
				studentStatus04: updatedStudentStatus04,
				studentStatus05: updatedStudentStatus05,
				studentStatus06: updatedStudentStatus06,
				studentStatus07: updatedStudentStatus07
			};

			await updateDoc(studentDocRef, updateData);

			alert('Student data updated successfully');
		} catch (error) {
			console.error('Error updating student data:', error);
			alert('Failed to update student data');
		} finally {
			isEditing = false;
		}
	};
</script>

<h1>$deptName Dashboard</h1>
<span>updated as of {currentDateTime}</span>

<br /><br /><br />

<StudentUpload />

<br /><br /><br />
<DataTable
	zebra
	sortable
	headers={[
		{ key: 'studNum', value: 'Student Number' },
		{ key: 'studNam', value: 'Student Name' },
		{ key: 'studSta', value: 'Status' }
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

<Toggle
	bind:toggled={updatedStudentStatus01}
	disabled={!isEditing}
	labelText="Student Status"
	labelA="Incomplete"
	labelB="Complete"
/>

<br />

<FluidForm>
	<TextInput readonly={!isEditing} labelText="Student Number" value={selectedStudentNumber} />
	<TextInput readonly={!isEditing} labelText="Student Name" value={selectedStudentName} />
</FluidForm>

<br /><br />

<TextArea
	readonly={!isEditing}
	labelText="Student Description"
	bind:value={selectedStudentDescription}
	maxCount={150}
/>
