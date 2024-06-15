<script>
	import { db } from '../firebaseConfig';
	import { collection, addDoc, query, where, getDocs } from 'firebase/firestore';
	import Papa from 'papaparse';

	let csvFile;

	const handleFileUpload = async (event) => {
		const file = event.target.files[0];

		Papa.parse(file, {
			header: true,
			complete: async (results) => {
				const admins = results.data;
				console.log('Parsed admins:', admins);

				for (const admin of admins) {
					// Log the current admin object to debug missing fields
					console.log('Current admin:', admin);

					// Validate and sanitize data
					const accountType = admin['account type'];
					const username = admin.username;
					const password = admin.password;
					const accountCode = admin['account code'];

					if (!accountType || !username || !password || !accountCode) {
						console.error('Missing required fields in admin data:', admin);
						continue; // Skip this iteration if validation fails
					}

					// Check if the username already exists
					const querySnapshot = await getDocs(
						query(collection(db, 'admins'), where('username', '==', username))
					);
					if (!querySnapshot.empty) {
						console.warn(`Admin with username ${username} already exists. Skipping.`);
						continue; // Skip this iteration if username exists
					}

					try {
						await addDoc(collection(db, 'admins'), {
							accountType: accountType,
							username: username,
							password: password,
							accountCode: accountCode
						});
						console.log(`Admin with username ${username} uploaded successfully.`);
					} catch (error) {
						console.error('Error adding document: ', error);
					}
				}

				console.log('All admins processed.');
			},
			error: (error) => {
				console.error('Error parsing CSV file:', error);
			}
		});
	};
</script>

IMPORT ADMIN CREDENTIALS HERE:
<input type="file" accept=".csv" on:change={handleFileUpload} />
