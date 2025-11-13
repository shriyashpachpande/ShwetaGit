import { useTranslation } from 'react-i18next';

export default function LanguageSelector() {
  const { i18n } = useTranslation();

  const handleChange = (event) => {
    i18n.changeLanguage(event.target.value);
  };

  return (
    <select onChange={handleChange} value={i18n.language}>
      <option value="en">English</option>
      <option value="hi">हिन्दी</option>
      <option value="mr">मराठी</option>
      <option value="ta">தமிழ்</option>
      <option value="gu">ગુજરાતી</option>
      <option value="te">తెలుగు</option>
      <option value="kn">ಕನ್ನಡ</option>

    </select>
  );
}
