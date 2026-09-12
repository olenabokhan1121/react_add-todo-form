import React, { useState } from 'react';
import usersFromServer from '../../api/users';
import { Todo } from '../../types.ts/Todo';
import { User } from '../../types.ts/User';
import { getUserById } from '../../utils/getUserByID';

interface Props {
  onAdd: (newTodo: Todo) => void;
  lastId: number;
}
interface FormData {
  title: string;
  user: User | null;
}
export const Form: React.FC<Props> = ({ onAdd, lastId }) => {
  const [count, setCount] = useState(0);
  const [touched, setTouched] = useState(false);
  const [form, setForm] = useState<FormData>({
    title: '',
    user: null,
  });
  const isError = !form.title.trim() || !form.user;

  function handleFormSubmit(event: React.FormEvent) {
    event?.preventDefault();
    setTouched(true);
    if (!isError) {
      onAdd({
        id: lastId + 1,
        title: form.title,
        completed: false,
        userId: form.user?.id,
        user: form.user,
      });
      setForm({
        title: '',
        user: null,
      });
      setCount(prev => prev + 1);
      setTouched(false);
    }
  }

  function handleFofmChange(name: string, value: string) {
    switch (name) {
      case 'title':
        setForm(prev => {
          return { ...prev, [name]: value };
        });

        break;
      case 'user':
        setForm(prev => {
          return {
            ...prev,
            [name]: getUserById(+value),
          };
        });
    }
  }

  return (
    <form
      action="/api/todos"
      method="POST"
      onSubmit={handleFormSubmit}
      key={count}
    >
      <div className="field">
        <input
          type="text"
          data-cy="titleInput"
          onChange={event =>
            handleFofmChange(event.target.name, event.target.value)
          }
          value={form.title}
          name="title"
          placeholder="Enter a title"
        />
        {!form.title.trim() && touched && (
          <span className="error">Please enter a title</span>
        )}
      </div>

      <div className="field">
        <select
          data-cy="userSelect"
          onChange={event =>
            handleFofmChange(event.target.name, event.target.value)
          }
          name="user"
          value={form.user?.id || 0}
        >
          <option value="0" disabled>
            Choose a user
          </option>
          {usersFromServer.map(user => (
            <option key={user.id} value={user.id}>
              {user.name}
            </option>
          ))}
        </select>

        {!form.user && touched && (
          <span className="error">Please choose a user</span>
        )}
      </div>

      <button type="submit" data-cy="submitButton">
        Add
      </button>
    </form>
  );
};
