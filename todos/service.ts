const todoDAO = require("./dao");
import { Todo } from "../ts";

exports.getTodos = async () => {
  return todoDAO.findAll();
};

exports.createTodo = async (todoData: Todo) => {
  let completedAtValue = todoData.completed_at;
  if (todoData.completed === true && todoData.completed_at === null) {
    completedAtValue = new Date();
  }
  const todoToCreate = { ...todoData, completed_at: completedAtValue };
  return todoDAO.create(todoToCreate);
};

exports.updateTodo = async (id: number, todoData: Todo) => {
  const todoToUpdate = { ...todoData };
  if (todoData.completed === true && !todoData.completed_at) {
    todoToUpdate.completed_at = new Date();
  } else if (todoData.completed === false) {
    todoToUpdate.completed_at = null;
  }
  return todoDAO.update(id, todoToUpdate);
};

exports.deleteTodo = async (id: number) => {
  return todoDAO.remove(id);
};