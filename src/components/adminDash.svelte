<script>
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
		ToolbarSearch
	} from 'carbon-components-svelte';

	import Edit from 'carbon-icons-svelte/lib/Edit.svelte';
	import Filter from 'carbon-icons-svelte/lib/Filter.svelte';
	import ImportExport from 'carbon-icons-svelte/lib/ImportExport.svelte';
	import Save from 'carbon-icons-svelte/lib/Save.svelte';

	let rows = Array.from({ length: 10 }).map((_, i) => ({
		id: i,
		studNum: 30000 + (i * 1000) / 5,
		studNam: 'STUDENT_NAME_HERE',
		studSta: i % 4 ? 'Complete' : 'Incomplete'
	}));
	let pageSize = 5;
	let page = 1;

	const now = new Date();
	const currentDateTime = now.toLocaleString();
</script>

<h1>$deptName Dashboard</h1>
<span>updated as of {currentDateTime}</span>

<br /><br /><br />

<DataTable
	sortable
	headers={[
		{ key: 'studNum', value: 'Student Number' },
		{ key: 'studNam', value: 'Student Name' },
		{ key: 'studSta', value: 'Status' }
	]}
	{pageSize}
	{page}
	{rows}
>
	<Toolbar>
		<ToolbarContent>
			<ToolbarSearch />
			<ToolbarMenu icon={Filter}>
				<ToolbarMenuItem primaryFocus>All</ToolbarMenuItem>
				<ToolbarMenuItem hasDivider>Complete</ToolbarMenuItem>
				<ToolbarMenuItem>Incomplete</ToolbarMenuItem>
			</ToolbarMenu>
			<Button kind="ghost" iconDescription="Edit" tooltipPosition="left" icon={Edit} />
			<Button kind="ghost" iconDescription="Save" tooltipPosition="left" icon={Save} />
			<ToolbarMenu icon={ImportExport}>
				<ToolbarMenuItem>Import CSV</ToolbarMenuItem>
				<ToolbarMenuItem>Export CSV</ToolbarMenuItem>
			</ToolbarMenu>
		</ToolbarContent>
	</Toolbar>
</DataTable>
<Pagination bind:pageSize bind:page totalItems={rows.length} pageSizeInputDisabled />

<br /><br /><br />

<FluidForm>
	<TextInput readonly labelText="Student Number" placeholder="$studentNumber" />
	<TextInput readonly labelText="Student Name" placeholder="$studentName" />
</FluidForm>

<br /><br />

<TextArea
	labelText="Student Description"
	placeholder="Enter details here if student is incomplete."
	maxCount={150}
/>
