<script>
	import { onMount } from 'svelte';
	import { auth, db } from '../firebaseConfig';
	import { collection, query, where, getDocs } from 'firebase/firestore';
	import { FluidForm, TextInput, PasswordInput, ButtonSet, Button } from 'carbon-components-svelte';
	import LoginIcon from 'carbon-icons-svelte/lib/Login.svelte';

	let username = '';
	let password = '';
	let accountType = ''; // This will be set after successful login

	const handleLogin = async () => {
		try {
			let userFound = false;

			// Query admins collection
			const adminsQuery = query(
				collection(db, 'admins'),
				where('username', '==', username),
				where('password', '==', password)
			);
			const adminsSnapshot = await getDocs(adminsQuery);

			adminsSnapshot.forEach((doc) => {
				if (doc.exists) {
					userFound = true;
					// Store account type after successful login
					accountType = doc.data().accountType;
					console.log('Admin found:', doc.data());
					// Store username and accountType in localStorage
					localStorage.setItem('currentUser', JSON.stringify({ username, accountType }));
					window.location.reload();
					// Redirect or perform other actions upon successful login
				}
			});

			// If admin not found, check students collection
			if (!userFound) {
				const studentsQuery = query(
					collection(db, 'students'),
					where('username', '==', username),
					where('password', '==', password)
				);
				const studentsSnapshot = await getDocs(studentsQuery);

				studentsSnapshot.forEach((doc) => {
					if (doc.exists) {
						userFound = true;
						// Store account type after successful login
						accountType = doc.data().accountType;
						console.log('Student found:', doc.data());
						// Store username and accountType in localStorage
						localStorage.setItem('currentUser', JSON.stringify({ username, accountType }));
						window.location.reload();
						// Redirect or perform other actions upon successful login
					}
				});
			}

			if (!userFound) {
				console.log('User not found or invalid credentials.');
				// Handle invalid login credentials
			}
		} catch (error) {
			console.error('Error logging in:', error);
			// Handle error logging in
		}
	};

	// Example function to handle sign up button click
	const handleSignUp = () => {
		// Implement sign up functionality
		console.log('Sign up clicked');
	};

	onMount(() => {
		// Initialize Firebase authentication if needed
		// Example: auth.signInWithEmailAndPassword(email, password);
	});
</script>

<FluidForm>
	<h1>Account Login</h1>
	<br /><br /><br />
	<TextInput
		bind:value={username}
		labelText="User name"
		placeholder="Enter user name..."
		required
	/>
	<PasswordInput
		bind:value={password}
		required
		type="password"
		labelText="Password"
		placeholder="Enter password..."
	/>
	<br /><br /><br />
	<ButtonSet stacked>
		<Button on:click={handleLogin} icon={LoginIcon}>Log in</Button>
	</ButtonSet>
</FluidForm>
