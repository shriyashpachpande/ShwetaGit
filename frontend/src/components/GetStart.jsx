import { useNavigate } from "react-router-dom";
import { useTranslation } from 'react-i18next';

const GetStarted = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleClick = () => {
    // 🔥 direct /insureIQ pe bhejna
    navigate("/insureIQ");
  };

  return (
    <div
      className="get-started cursor-pointer w-35 h-12 rounded-full" // 👈 outer div rounded
      style={{
        boxShadow:
          "rgba(0, 0, 0, 0.09) 0px 2px 1px, rgba(0, 0, 0, 0.09) 0px 4px 2px, rgba(0, 0, 0, 0.09) 0px 8px 4px, rgba(0, 0, 0, 0.09) 0px 16px 8px, rgba(0, 0, 0, 0.09) 0px 32px 16px",
      }}
    >
      <button
        onClick={handleClick}
        className="bg-black w-full h-full text-white cursor-pointer px-6 py-2 rounded-full hover:bg-gray-900 transition-all duration-300"
      >
        {t('Get Started')}
      </button>
    </div>
  );
};

export default GetStarted;
