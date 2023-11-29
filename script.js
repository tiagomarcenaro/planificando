const express = require('express');
const mysql = require('mysql');

const app = express();
const port = 3000;

const db = mysql.createConnection({
  host: 'localhost',
  user: 'tu_usuario',
  password: 'tu_contraseña',
  database: 'planning',
});

db.connect((err) => {
  if (err) {
    throw err;
  }
  console.log('Conectado a la base de datos');
});

app.use(express.json());

// Obtener todas las tareas
app.get('/api/tasks', (req, res) => {
  db.query('SELECT * FROM todo', (err, result) => {
    if (err) {
      res.status(500).send('Error al obtener las tareas');
    } else {
      res.json(result);
    }
  });
});

// Crear una nueva tarea
app.post('/api/tasks', (req, res) => {
  const { name, description, status } = req.body;
  db.query(
    'INSERT INTO todo (name, description, status) VALUES (?, ?, ?)',
    [name, description, status],
    (err, result) => {
      if (err) {
        res.status(500).send('Error al crear la tarea');
      } else {
        res.json({ id: result.insertId, name, description, status });
      }
    }
  );
});

// Actualizar una tarea
app.put('/api/tasks/:id', (req, res) => {
  const taskId = req.params.id;
  const { name, description, status } = req.body;
  db.query(
    'UPDATE todo SET name = ?, description = ?, status = ? WHERE id = ?',
    [name, description, status, taskId],
    (err) => {
      if (err) {
        res.status(500).send('Error al actualizar la tarea');
      } else {
        res.send('Tarea actualizada correctamente');
      }
    }
  );
});

// Eliminar una tarea
app.delete('/api/tasks/:id', (req, res) => {
  const taskId = req.params.id;
  db.query('DELETE FROM todo WHERE id = ?', [taskId], (err) => {
    if (err) {
      res.status(500).send('Error al eliminar la tarea');
    } else {
      res.send('Tarea eliminada correctamente');
    }
  });
});

app.listen(port, () => {
  console.log(`El servidor está escuchando en el puerto ${port}`);
});
