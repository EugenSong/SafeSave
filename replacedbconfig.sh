#!/bin/bash

# Define the root directory of your project (current directory)
project_root="."

# Define the content replacements for 'db-connector.mjs'
replacement1='let dbConfig = {
    host: '\''classmysql.engr.oregonstate.edu'\'',
    user: '\''capstone_2023_securepass1'\'',
    password: '\''zxob8b@T8!yF'\'',
    database: '\''capstone_2023_securepass1'\'',
    multipleStatements: true
}
export { dbConfig }'

replacement2='import { createPool } from '\''mysql'\'';
 
// Create a '\''connection pool'\'' using the provided credentials
var pool = createPool({
    connectionLimit: 10,
    host: '\''classmysql.engr.oregonstate.edu'\'',
    user: '\''capstone_2023_securepass1'\'',
    password: '\''zxob8b@T8!yF'\'',
    database: '\''capstone_2023_securepass1'\''
})
 
export { pool };'

# Find all 'db-connector.mjs' files in the project root and its subdirectories
find "$project_root" -type f -name 'db-connector.mjs' | while read -r file; do
  # Read the content of the file
  file_content=$(<"$file")
  
  # Check if the file content matches 'let dbConfig = {}'
  if [[ "$file_content" == *"let dbConfig = "* ]]; then
    echo "Updating $file"
    echo -e "$replacement1" > "$file"
  # Check if the file content matches 'import { createPool }'
  elif [[ "$file_content" == *"import { createPool }"* ]]; then
    echo "Updating $file"
    echo -e "$replacement2" > "$file"
  else
    echo "Skipping $file"
  fi
done

