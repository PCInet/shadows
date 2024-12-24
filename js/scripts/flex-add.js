import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';

dotenv.config();

// Get the current file's directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const flexComponentName = process.argv[2];

const path = `../../flex-components/${flexComponentName}.tar.bz2`;

const flexComponentPath = join(__dirname, path);

// Read file and convert Buffer to Blob
const fileBuffer = fs.readFileSync(flexComponentPath);
const flexComponent = new Blob([fileBuffer]);

const formData = new FormData();
formData.append('Ignore_Dependencies', 'false');
formData.append('Overwrite_Registered', 'false');
formData.append('FlexComponent', flexComponent, flexComponentName + '.tar.bz2');

const query = new URLSearchParams({
	Store_Code: process.env.STORE_CODE,
	Function: 'Module',
	Module_Code: 'flex-json-api',
	Module_Function: 'FlexComponent_Upload',
});

fetch(`${process.env.STORE_URL}/mm5/json.mvc?${query.toString()}`, {
  method: 'POST',
  body: formData,
})
  .then(response => response.text())
  .then(data => {
	  let d;
	  try {
	  	d = JSON.parse(data);
	  } catch (error) {
		  d = data;
	  }

	  console.log(d);
	})
  .catch(error => console.error(error));

	