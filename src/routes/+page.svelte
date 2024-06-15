<script>
	import Login from '../components/login.svelte';
	import AdminDashboard from '../components/adminDash.svelte';
	import StudentDashboard from '../components/studentDash.svelte';

	import {
		Content,
		Header,
		HeaderGlobalAction,
		HeaderUtilities,
		SkipToContent
	} from 'carbon-components-svelte';

	import Logout from 'carbon-icons-svelte/lib/Logout.svelte';
	import SettingsAdjust from 'carbon-icons-svelte/lib/SettingsAdjust.svelte';
	import UserAvatarFilledAlt from 'carbon-icons-svelte/lib/UserAvatarFilledAlt.svelte';

	let isSideNavOpen = false;
</script>

<Header company="Project" platformName="CLARENCE" bind:isSideNavOpen>
	<svelte:fragment slot="skip-to-content">
		<SkipToContent />
	</svelte:fragment>
	<HeaderUtilities>
		<HeaderGlobalAction iconDescription="Settings" tooltipAlignment="start" icon={SettingsAdjust} />
		<HeaderGlobalAction iconDescription="Profile" icon={UserAvatarFilledAlt} />
		<HeaderGlobalAction iconDescription="Log out" tooltipAlignment="end" icon={Logout} />
	</HeaderUtilities>
</Header>

<Content>
	<Login />
</Content>
