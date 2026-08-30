import { auth } from "../configs/auth";

async function main() {
  const newUser = await auth.api.createUser({
    body: {
      email: "demo@gmail.com",
      password: "DemoPassword",
      name: "Demo",
      role: "user",
    },
  });
  console.log(newUser);
}

main();