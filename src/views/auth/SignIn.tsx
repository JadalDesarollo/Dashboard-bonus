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
    login: ''
  });
  const [isLoadingLogin, setisLoadingLogin] = useState(false)
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
    if (!formData.email.trim()) {
      newErrors.email = 'Por favor, ingresa tu correo electrónico';
      isValid = false;
    }
    if (!formData.password.trim()) {
      newErrors.password = 'Por favor, ingresa tu contraseña';
      isValid = false;
    }
    setFormErrors(newErrors);
    return isValid;
  };
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (validateForm()) {
      setisLoadingLogin(true)
      const status = await login(formData.email, formData.password);
      setisLoadingLogin(false)
      if (status) {
        navigate('/admin')
      } else {
        setFormErrors({
          ...formErrors,
          login: 'Usuario o contraseña incorrectos'
        })
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
          {formErrors.email != "" && !isLoadingLogin ? (
            <p className="text-red-300 text-sm mb-1">{formErrors.email}</p>
          ) : null}
          {formErrors.password != "" && formErrors.email == "" && !isLoadingLogin ? (
            <p className="text-red-300 text-sm mb-1">{formErrors.password}</p>
          ) : null}
          {formErrors.login && !isLoadingLogin ? (
            <p className="text-red-300 text-sm mb-1">{formErrors.login}</p>
          ) : null}
          {
            isLoadingLogin ? (
              <p className="text-green-300 text-sm mb-1"><div className="text-start mb-6 mt-9 flex justify-center">
                <div role="status">
                  <svg aria-hidden="true" className="inline w-8 h-8 mr-0 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                  </svg>
                  <span className="sr-only">Loading...</span>
                </div>
              </div></p>
            ) : null
          }

          <InputField
            variant="auth"
            extra="mb-3"
            label="Usuario*"
            placeholder="Ingrese su usuario"
            id="email"
            type="text"
            onChange={handleInputChange}
            autoComplete="current-password"
          />

          {/* Password */}
          <InputField
            variant="auth"
            extra="mb-3"
            label="Contraseña*"
            placeholder="Ingrese su contraseña"
            id="password"
            type="password"
            autoComplete="current-password"
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
