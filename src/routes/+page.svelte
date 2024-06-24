<script>
	import { onMount } from 'svelte';
	import { auth } from '../firebaseConfig';
	import Login from '../components/login.svelte';
	import AdminDashboard from '../components/adminDash.svelte';
	import StudentDashboard from '../components/studentDash.svelte';
	import AdminUpload from '../components/adminUpload.svelte';
	import StudentUpload from '../components/studentUpload.svelte';

	import {
		Content,
		Header,
		HeaderGlobalAction,
		HeaderUtilities,
		SkipToContent
	} from 'carbon-components-svelte';

	import LogoutIcon from 'carbon-icons-svelte/lib/Logout.svelte';
	import SettingsAdjustIcon from 'carbon-icons-svelte/lib/SettingsAdjust.svelte';
	import UserAvatarFilledAltIcon from 'carbon-icons-svelte/lib/UserAvatarFilledAlt.svelte';

	let isSideNavOpen = false;
	let currentUser = null;

	// Function to retrieve currentUser from localStorage
	const getCurrentUser = () => {
		const user = localStorage.getItem('currentUser');
		if (user) {
			return JSON.parse(user);
		}
		return null;
	};

	onMount(() => {
		currentUser = getCurrentUser();
	});

	const handleLogout = () => {
		// Clear currentUser from localStorage
		localStorage.removeItem('currentUser');
		currentUser = null; // Update currentUser in component state
	};
</script>

<Header company="DEMO | Project" platformName="CLARENCE" bind:isSideNavOpen>
	<svelte:fragment slot="skip-to-content">
		<SkipToContent />
	</svelte:fragment>
	<HeaderUtilities>
		<HeaderGlobalAction
			iconDescription="Log out"
			tooltipAlignment="end"
			icon={LogoutIcon}
			on:click={handleLogout}
		/>
	</HeaderUtilities>
</Header>

<Content>
	{#if currentUser}
		{#if currentUser.accountType == 'libr' || currentUser.accountType == 'alum' || currentUser.accountType == 'osas' || currentUser.accountType == 'guid' || currentUser.accountType == 'dean' || currentUser.accountType == 'finc' || currentUser.accountType == 'regs'}
			<AdminDashboard />
		{:else if currentUser.accountType == 'stud'}
			<StudentDashboard />
		{:else}
			Invalid credentials.
		{/if}
	{:else}
		<Login />
		<br /><br /><br />
		<!-- <AdminUpload />
		<br />
		<StudentUpload /> -->
	{/if}
</Content>
