import { exec } from "child_process";

const command = `psql -U scarico -d todo_app -f seed.sql`;

exec(command, (error, stdout, stderr) => {
  if (error) {
    console.error(`Error seeding database: ${error.message}`);
    return;
  }
  if (stderr) {
    console.error(`stderr: ${stderr}`);
    return;
  }
  console.log(`Database seeded successfully:\n${stdout}`);
});
