import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useToasts } from 'react-toast-notifications';
import ListItem from './components/ListItem/ListItem';
import Modal from './components/Modal/Modal';
import './App.css';

function App() {
  const [persons, setPersons] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [personChanged, setPersonChanged] = useState({});
  const [personDeleteTrigger, setPersonDeleteTrigger] = useState(false);
  const [personRemove, setPersonRemove] = useState(false);

  const { addToast } = useToasts();

  useEffect(() => {
    axios.get('http://localhost:3000/persons')
      .then((resp) => {
        setPersons(resp.data);
      }).catch((e) => {
        if (!e.response)
          addToast('Отсутвствет соеденение с сервером', {
            appearance: 'error',
            autoDismiss: true,
          });
        else if (e.response.status === 404) {
          addToast('404 Адрес не найден', {
            appearance: 'error',
            autoDismiss: true,
          });
        } else if (e.response.status === 500) {
          addToast('Ошибка сервера, повторите попытку позже', {
            appearance: 'error',
            autoDismiss: true,
          });
        }
      });
  }, [modalOpen, personDeleteTrigger]);

  useEffect(() => {
    if (persons.length > 0) setModalOpen((prevState) => !prevState);
  }, [personChanged]);

  const removeOrChange = (person, remove) => {
    setPersonRemove(remove);
    setPersonChanged(person);
  };

  return (
    <div className="App">
      <ListItem title />
      {
          persons.map((person) => (
            <ListItem
              key={person.id}
              person={person}
              changePerson={removeOrChange}
              personDeleteTrigger={() => (setPersonDeleteTrigger((prevState) => !prevState))}
            />
          ))
                }
      {
          modalOpen
          && (
          <Modal
            person={personChanged}
            personRemove={personRemove}
            close={() => setPersonChanged({})}
          />
          )
                }
      <button className="button" type="button" onClick={() => removeOrChange({}, false)}>
        Добавить
        сотрудника
      </button>
    </div>
  );
}

export default App;
