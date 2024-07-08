import React from 'react';
import { Dropdown } from 'react-bootstrap';
import { useContext } from 'react';
import { AuthContext } from '../../auth/AuthContext';
import { User } from 'react-feather'; // Asegúrate de importar el ícono User
import { Link } from 'react-router-dom';

const ProfileMenu = ({reloadAll}) => {
    const { LogOut } = useContext(AuthContext);

    const handleLogout = () => {
        LogOut();
        reloadAll(); 
    };

    return (
        <Dropdown align="end" style={{ zIndex: "1050" }}> {/* Asegúrate de que el z-index es suficientemente alto */}
            <Dropdown.Toggle variant="link" id="dropdown-basic" className="text-reset" style={{ zIndex: "1051" }}>
                <User />
            </Dropdown.Toggle>

            <Dropdown.Menu style={{ zIndex: "1052" }}>
                <Dropdown.Item as={Link} to="/Perfil">Editar perfil</Dropdown.Item>
                <Dropdown.Item onClick={handleLogout}>Cerrar sesión</Dropdown.Item>
            </Dropdown.Menu>
        </Dropdown>
    );
};

export default ProfileMenu;
