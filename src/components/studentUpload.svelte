<script>
	import { db } from '../firebaseConfig';
	import { collection, addDoc } from 'firebase/firestore';
	import Papa from 'papaparse';

	let csvFile;

	const handleFileUpload = async (event) => {
		const file = event.target.files[0];

		Papa.parse(file, {
			header: true,
			complete: async (results) => {
				const students = results.data;
				console.log('Parsed students:', students);

				for (const student of students) {
					// Log the current student object to debug missing fields
					console.log('Current student:', student);

					// Extract and validate required fields
					const accountType = student['account type'];
					const lastName = student['last name'];
					const firstName = student['first name'];
					const middleName = student['middle name'];
					let studentNumber = student['student number'];

					// Skip this student if any required field is missing
					if (!accountType || !lastName || !firstName || !middleName || !studentNumber) {
						console.error('Missing required fields in student data:', student);
						continue;
					}

					// Trim and sanitize studentNumber (if needed)
					studentNumber = studentNumber.trim();

					// Generate username and password
					const last6Digits = studentNumber.slice(-6);
					const password = `${lastName}.${last6Digits}`;

					// Extract optional fields with default values
					const description = student['description'] || '';
					const alumDescription = student['alumDescription'] || '';
					const alumStatus = convertToBoolean(student['alumStatus']);
					const deanDescription = student['deanDescription'] || '';
					const deanStatus = convertToBoolean(student['deanStatus']);
					const fincDescription = student['fincDescription'] || '';
					const fincStatus = convertToBoolean(student['fincStatus']);
					const guidDescription = student['guidDescription'] || '';
					const guidStatus = convertToBoolean(student['guidStatus']);
					const librDescription = student['librDescription'] || '';
					const librStatus = convertToBoolean(student['librStatus']);
					const osasDescription = student['osasDescription'] || '';
					const osasStatus = convertToBoolean(student['osasStatus']);
					const regsDescription = student['regsDescription'] || '';
					const regsStatus = convertToBoolean(student['regsStatus']);

					try {
						await addDoc(collection(db, 'students'), {
							accountType,
							lastName,
							firstName,
							middleName,
							studentNumber,
							username: studentNumber,
							password,
							description,
							alumDescription,
							alumStatus,
							deanDescription,
							deanStatus,
							fincDescription,
							fincStatus,
							guidDescription,
							guidStatus,
							librDescription,
							librStatus,
							osasDescription,
							osasStatus,
							regsDescription,
							regsStatus
						});

						console.log(`Added student ${firstName} ${lastName} (${studentNumber}) successfully`);
					} catch (error) {
						console.error('Error adding document: ', error);
					}
				}

				console.log('All students uploaded successfully');
			},
			error: (error) => {
				console.error('Error parsing CSV file:', error);
			}
		});
	};

	const convertToBoolean = (value) => {
		return value === 'true' || value === '1';
	};
</script>

To import student data, load the CSV masterlist file here:
<input type="file" accept=".csv" on:change={handleFileUpload} />
