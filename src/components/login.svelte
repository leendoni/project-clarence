<script>
	import { FluidForm, TextInput, PasswordInput, ButtonSet, Button } from 'carbon-components-svelte';
	import Login from 'carbon-icons-svelte/lib/Login.svelte';
</script>

<FluidForm>
	<h1>Account Login</h1>
	<br /><br /><br />
	<TextInput labelText="User name" placeholder="Enter user name..." required />
	<PasswordInput required type="password" labelText="Password" placeholder="Enter password..." />
	<br /><br /><br />
	<ButtonSet stacked>
		<Button icon={Login}>Log in</Button>
		<Button kind="ghost">Sign up</Button>
	</ButtonSet>
</FluidForm>
