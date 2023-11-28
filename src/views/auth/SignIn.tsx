import InputField from "components/fields/InputField";
import { FcGoogle } from "react-icons/fc";
import Checkbox from "components/checkbox";
import { useAuthContext } from "auth/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function SignIn() {
  const { login } = useAuthContext();
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [formErrors, setFormErrors] = useState({
    email: '',
    password: '',
  });

  const handleInputChange = (e: any) => {
    const { id, value } = e.target;
    setFormData({
      ...formData,
      [id]: value,
    });
    setFormErrors({
      ...formErrors,
      [id]: '',
    });
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = { ...formErrors };

    // Validación del correo electrónico
    if (!formData.email) {
      newErrors.email = 'Por favor, ingresa tu correo electrónico';
      isValid = false;
    }

    // Validación de la contraseña
    if (!formData.password) {
      newErrors.password = 'Por favor, ingresa tu contraseña';
      isValid = false;
    }

    setFormErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (validateForm()) {
      // Realizar el inicio de sesión
      const status = await login(formData.email, formData.password);

      if (status) {
        navigate('admin')
      } else {
        console.log('fallo login')
      }
    }
  };

  return (
    <div className="mt-16 mb-16 flex h-full w-full items-center justify-center px-2 md:mx-0 md:px-0 lg:mb-10 lg:items-center lg:justify-start">
      {/* Sign in section */}
      <div className="mt-[10vh] w-full max-w-full flex-col items-center md:pl-4 lg:pl-0 xl:max-w-[420px]">
        <h4 className="mb-2.5 text-4xl font-bold text-navy-700 dark:text-white">
          Inicio de Sesión
        </h4>
        <p className="mb-9 ml-1 text-base text-gray-600">
          Ingresa tu usuario y contraseña para iniciar sesión
        </p>
        <div className="mb-6 flex items-center  gap-3">
          <div className="h-px w-full bg-gray-200 dark:bg-navy-700" />
          <p className="text-base text-gray-600 dark:text-white">  </p>
          <div className="h-px w-full bg-gray-200 dark:bg-navy-700" />
        </div>
        <form onSubmit={handleSubmit}>
          {/* Email */}
          {formErrors.email && formErrors.password ? (
            <p className="text-red-300 text-sm mt-1">{formErrors.email}</p>
          ) : null}

          {formErrors.password && !formErrors.email ? (
            <p className="text-red-300 text-sm mt-1">{formErrors.email}</p>
          ) : null}
          <InputField
            variant="auth"
            extra="mb-3"
            label="Usuario*"
            placeholder="Ingrese su usuario"
            id="email"
            type="text"
            onChange={handleInputChange}

          />

          {/* Password */}
          <InputField
            variant="auth"
            extra="mb-3"
            label="Contraseña*"
            placeholder="Ingrese su contraseña"
            id="password"
            type="password"
            onChange={handleInputChange}
          />

          {/* Checkbox */}
          <button className="linear mt-2 w-full rounded-xl bg-brand-500 py-[12px] text-base font-medium text-white transition duration-200 hover:bg-brand-600 active:bg-brand-700 dark:bg-brand-400 dark:text-white dark:hover:bg-brand-300 dark:active:bg-brand-200">
            Iniciar Sesión
          </button>
        </form>
        <div className="mt-4">

        </div>
      </div>
    </div>
  );
}
