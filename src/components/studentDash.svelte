<script>
	import { DataTable } from 'carbon-components-svelte';

	const now = new Date();
	const currentDateTime = now.toLocaleString();
</script>

<h1>Student Clearance Form</h1>
<span>updated as of {currentDateTime}</span>

<br /><br /><br />

<span>$lastName, $firstName $middleName</span>

<br /><br /><br />

<DataTable
	zebra
	size="medium"
	headers={[
		{ key: 'deptName', value: 'Department' },
		{ key: 'deptHead', value: 'Head / Coordinator' },
		{ key: 'deptStatus', value: 'Status' },
		{ key: 'deptDetail', value: 'Details' }
	]}
	rows={[
		{
			id: 'a',
			deptName: 'Library',
			deptHead: '$nameOfLibrarian',
			deptStatus: '$statusHere',
			deptDetail: '$detailHere'
		},
		{
			id: 'b',
			deptName: 'Alumni & Placement',
			deptHead: '$nameOfAlumniCoord',
			deptStatus: '$statusHere',
			deptDetail: '$detailHere'
		},
		{
			id: 'c',
			deptName: 'OSAS & POD',
			deptHead: '$nameOfPOD',
			deptStatus: '$statusHere',
			deptDetail: '$detailHere'
		},
		{
			id: 'd',
			deptName: 'Guidance Office',
			deptHead: '$nameOfGuidCoun',
			deptStatus: '$statusHere',
			deptDetail: '$detailHere'
		},
		{
			id: 'e',
			deptName: 'Dean / Academic Head',
			deptHead: '$nameOfDean',
			deptStatus: '$statusHere',
			deptDetail: '$detailHere'
		},
		{
			id: 'f',
			deptName: 'Finance Office',
			deptHead: '$nameOfFincOfficer',
			deptStatus: '$statusHere',
			deptDetail: '$detailHere'
		},
		{
			id: 'g',
			deptName: 'Registry Office',
			deptHead: '$nameOfRegistrar',
			deptStatus: '$statusHere',
			deptDetail: '$detailHere'
		}
	]}
/>

<br /><br />

NOTE: Tampering with this digital clearance form is equivalent to a major offense.
