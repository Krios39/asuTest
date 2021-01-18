import React from 'react';
import PropTypes from 'prop-types';
import './ListItem.css';
import { RiPencilFill } from 'react-icons/ri';
import { AiFillDelete } from 'react-icons/ai';

function ListItem({
  person, title, changePerson,
}) {
  return (
    <div>
      {title ? (
        <div className="titleBox">
          <p className="nameBox">
            Имя
          </p>
          <p className="nameBox">
            Фамилия
          </p>
        </div>
      )
        : (
          <div className="personBox">
            <div className="nameBox">{person.firstName}</div>
            <div className="nameBox">{person.lastName}</div>
            <div className="iconButton" onClick={() => changePerson(person, false)} aria-hidden="true"><RiPencilFill size="24px" color="737373" /></div>
            <div className="iconButton" onClick={() => changePerson(person, true)} aria-hidden="true"><AiFillDelete size="24px" color="737373" /></div>
          </div>
        )}
    </div>
  );
}

ListItem.propTypes = {
  person: PropTypes.objectOf(PropTypes.any),
  title: PropTypes.bool,
  changePerson: PropTypes.func,
};
ListItem.defaultProps = {
  person: {},
  title: false,
  changePerson: () => {},
};

export default ListItem;
