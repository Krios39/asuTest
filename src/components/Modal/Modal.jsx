import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { useToasts } from 'react-toast-notifications';
import './Modal.css';

function Modal({ person, close, personRemove }) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [title, setTitle] = useState('Добавление сотрудника');
  const [newId, setNewId] = useState(null);
  const [emptyInputs, setEmptyFields] = useState(true);

  const { addToast } = useToasts();

  useEffect(() => {
    if (person.id) {
      setFirstName(person.firstName);
      setLastName(person.lastName);
      if (personRemove) setTitle('Удаление сотрудника');
      else setTitle('Редактирование сотрудника');
    }
  }, [person]);

  useEffect(() => {
    // eslint-disable-next-line no-use-before-define
    if (newId) createPerson();
  }, [newId]);

  useEffect(() => {
    if (firstName && lastName && firstName.trim() !== '' && lastName.trim() !== '') {
      setEmptyFields(false);
    } else setEmptyFields(true);
  }, [firstName, lastName]);

  const modalClose = () => {
    setFirstName('');
    setLastName('');
    setTitle('');
    close();
  };

  const toastError = (e) => {
    if (e.response.status === 404) {
      addToast('404 Адрес не найден', {
        appearance: 'error',
        autoDismiss: true,
      });
    }
    if (e.response.status === 500) {
      addToast('Ошибка сервера', {
        appearance: 'error',
        autoDismiss: true,
      });
    }
  };

  const toastSuccess = (text) => {
    addToast(text, {
      appearance: 'success',
      autoDismiss: true,
    });
  };

  const getNewId = () => {
    axios.get('http://localhost:3000/persons')
      .then((resp) => {
        setNewId(resp.data[resp.data.length - 1].id + 1);
      });
  };

  const changePerson = () => {
    axios.put(`http://localhost:3000/persons/${person.id}`, {
      id: null,
      firstName,
      lastName,
    }).then(() => {
      modalClose();
      toastSuccess('Сотрудник успешно изменён');
    }).catch((e) => {
      toastError(e);
      modalClose();
    });
  };

  const createPerson = () => {
    axios.post('http://localhost:3000/persons', {
      id: newId,
      firstName,
      lastName,
    }).then(() => {
      modalClose();
      toastSuccess('Сотрудник успешно создан');
    }).catch((e) => {
      toastError(e);
      modalClose();
    });
  };

  const deletePerson = () => {
    axios.delete(`http://localhost:3000/persons/${person.id}`)
      .then(() => {
        modalClose();
        toastSuccess('Сотрудник успешно удалён');
      }).catch((e) => {
        toastError(e);
        modalClose();
      });
  };

  const inputsCheck = () => {
    if (person.id) changePerson();
    else getNewId();
  };

  const handleInputChange = (event) => {
    const { target } = event;
    const name = target.name === 'firstName' ? setFirstName : setLastName;
    name(target.value);
  };

  return (
    <div className="modalOverlay">
      <div className="modalWindow">
        <div className="modalHeader">{title}</div>
        {
          personRemove ? (
            <div>
              <div className="text">
                Вы уверены что хотите удалить
                {` ${firstName} ${lastName}`}
                ?
              </div>
              <div className="buttonBox">
                <button className="modalButton" type="button" onClick={modalClose}>Нет</button>
                <button className="modalButton" type="button" onClick={deletePerson}>Да</button>
              </div>
            </div>
          ) : (
            <div>
              <input className="input" name="firstName" value={firstName} onChange={(event) => handleInputChange(event)} />
              <input className="input" name="lastNAme" value={lastName} onChange={(event) => handleInputChange(event)} />
              <div className="buttonBox">
                <button disabled={emptyInputs} className="modalButton" type="button" onClick={inputsCheck}>Сохранить</button>
                <button className="modalButton" type="button" onClick={modalClose}>Отмена</button>
              </div>
            </div>
          )
}
      </div>
    </div>
  );
}

Modal.propTypes = {
  person: PropTypes.objectOf(PropTypes.any),
  close: PropTypes.func,
  personRemove: PropTypes.bool,
};
Modal.defaultProps = {
  person: {},
  close: () => {},
  personRemove: false,
};

export default Modal;
