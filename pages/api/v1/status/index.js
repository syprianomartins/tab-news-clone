import database from "../../../../infra/database";
async function status(request, response) {
  const result = await database.query("SELECT 1 + 1 AS sum;");
  console.log(result.rows);
  response
    .status(200)
    .json({ message: "alunos do curso.dev são acima da media" });
}

export default status;
