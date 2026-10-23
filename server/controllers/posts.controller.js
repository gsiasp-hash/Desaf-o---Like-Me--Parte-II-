import { pool } from "../db.js";

export const getPosts = async (req, res) => {
  try {
    const { rows } = await pool.query("SELECT * FROM posts ORDER BY id");
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener los posts" });
  }
};

export const createPost = async (req, res) => {
  try {
    // El frontend envía la imagen como "url"; en la tabla es la columna "img"
    const { titulo, url, img, descripcion } = req.body;
    const { rows } = await pool.query(
      "INSERT INTO posts (titulo, img, descripcion, likes) VALUES ($1, $2, $3, 0) RETURNING *",
      [titulo, url ?? img, descripcion]
    );
    res.status(201).json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al crear el post" });
  }
};

export const likePost = async (req, res) => {
  try {
    const { rows } = await pool.query(
      "UPDATE posts SET likes = COALESCE(likes, 0) + 1 WHERE id = $1 RETURNING *",
      [req.params.id]
    );
    if (rows.length === 0) return res.status(404).json({ error: "Post no encontrado" });
    res.json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al dar like al post" });
  }
};

export const deletePost = async (req, res) => {
  try {
    const { rowCount } = await pool.query("DELETE FROM posts WHERE id = $1", [req.params.id]);
    if (rowCount === 0) return res.status(404).json({ error: "Post no encontrado" });
    res.json({ message: "Post eliminado" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al eliminar el post" });
  }
};
