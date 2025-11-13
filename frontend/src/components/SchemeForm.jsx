// import { useState } from 'react';
// import axios from 'axios';

// export default function SchemeForm() {
//   const [form, setForm] = useState({
//     schemeName: '',
//     coveredDiseases: '',
//     maxClaimLimit: '',
//     description: ''
//   });

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     await axios.post('http://localhost:5000/api/govt-schemes/add', {
//       schemeName: form.schemeName,
//       coveredDiseases: form.coveredDiseases.split(',').map(d => d.trim()),
//       maxClaimLimit: form.maxClaimLimit,
//       description: form.description
//     });

//     alert('Scheme Added Successfully');
//     setForm({ schemeName: '', coveredDiseases: '', maxClaimLimit: '', description: '' });
//   };

//   return (
//     <form onSubmit={handleSubmit}>
//       <input type="text" placeholder="Scheme Name" value={form.schemeName} onChange={e => setForm({...form, schemeName: e.target.value})} required />
//       <input type="text" placeholder="Covered Diseases (comma separated)" value={form.coveredDiseases} onChange={e => setForm({...form, coveredDiseases: e.target.value})} required />
//       <input type="text" placeholder="Max Claim Limit" value={form.maxClaimLimit} onChange={e => setForm({...form, maxClaimLimit: e.target.value})} required />
//       <textarea placeholder="Description" value={form.description} onChange={e => setForm({...form, description: e.target.value})} required />
//       <button type="submit">Add Scheme</button>
//     </form>
//   );
// }





























import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { gsap } from "gsap";

export default function SchemeForm() {
  const [form, setForm] = useState({
    schemeName: "",
    coveredDiseases: "",
    maxClaimLimit: "",
    description: "",
  });

  const formRef = useRef(null);
  const buttonRef = useRef(null);
  const inputRefs = useRef([]);

  useEffect(() => {
    // Animate form container
    gsap.from(formRef.current, {
      opacity: 0,
      y: 50,
      duration: 1,
      ease: "power3.out",
    });

    // Animate inputs one by one
    gsap.from(inputRefs.current, {
      opacity: 0,
      x: -30,
      duration: 0.6,
      stagger: 0.2,
      delay: 0.3,
      ease: "power2.out",
    });

    // Animate button
    //     gsap.from(buttonRef.current, {
    //   scale: 0,
    //   duration: 0.5,
    //   delay: 1,
    //   ease: "back.out(1.7)",
    // });

  }, []);
const API_BASE = import.meta.env.VITE_API_BASE + "/api";
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      

await axios.post(`${API_BASE}/govt-schemes/add`, {
  schemeName: form.schemeName,
  coveredDiseases: form.coveredDiseases.split(",").map((d) => d.trim()),
  maxClaimLimit: form.maxClaimLimit,
  description: form.description,
});

      alert("✅ Scheme Added Successfully!");
      setForm({
        schemeName: "",
        coveredDiseases: "",
        maxClaimLimit: "",
        description: "",
      });
    } catch (err) {
      alert("❌ Error adding scheme. Try again.");
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br bg-[#f5f5f5] p-5">
      <div
        ref={formRef}
        className="w-full max-w-lg bg-[#f5f5f5] rounded-2xl shadow-2xl p-8 sm:p-10"
      >
        <h2 className="text-3xl sm:text-4xl font-extrabold text-center text-gray-800 mb-8">
          Add Government Scheme
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Scheme Name */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Scheme Name
            </label>
            <input
              ref={(el) => (inputRefs.current[0] = el)}
              type="text"
              placeholder="Enter scheme name"
              value={form.schemeName}
              onChange={(e) =>
                setForm({ ...form, schemeName: e.target.value })
              }
              required
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-800"
              style={{
                boxShadow:
                  "rgba(0,0,0,0.16) 0px 3px 6px, rgba(0,0,0,0.23) 0px 3px 6px",
              }}
            />
          </div>

          {/* Covered Diseases */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Covered Diseases
            </label>
            <input
              ref={(el) => (inputRefs.current[1] = el)}
              type="text"
              placeholder="e.g. Diabetes, Cancer"
              value={form.coveredDiseases}
              onChange={(e) =>
                setForm({ ...form, coveredDiseases: e.target.value })
              }
              required
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-800"
              style={{
                boxShadow:
                  "rgba(0,0,0,0.16) 0px 3px 6px, rgba(0,0,0,0.23) 0px 3px 6px",
              }}
            />
          </div>

          {/* Max Claim Limit */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Max Claim Limit
            </label>
            <input
              ref={(el) => (inputRefs.current[2] = el)}
              type="number"
              placeholder="Enter max claim limit"
              value={form.maxClaimLimit}
              onChange={(e) =>
                setForm({ ...form, maxClaimLimit: e.target.value })
              }
              required
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-800"
              style={{
                boxShadow:
                  "rgba(0,0,0,0.16) 0px 3px 6px, rgba(0,0,0,0.23) 0px 3px 6px",
              }}
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Description
            </label>
            <textarea
              ref={(el) => (inputRefs.current[3] = el)}
              placeholder="Enter scheme description"
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              required
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-800 resize-none h-28"
              style={{
                boxShadow:
                  "rgba(0,0,0,0.16) 0px 3px 6px, rgba(0,0,0,0.23) 0px 3px 6px",
              }}
            />
          </div>

          {/* Submit Button */}
          <div className="text-center">
            <button
              ref={buttonRef}
              type="submit"
              className="px-8 py-3 sm:px-10 sm:py-4 

rounded-xl text-black hite font-bold text-lg 
hover:scale-105 hover:shadow-xl transition-transform shadow-lg"

              style={{
                boxShadow:
                  "rgba(0,0,0,0.16) 0px 3px 6px, rgba(0,0,0,0.23) 0px 3px 6px",
              }}
            >
              Add Scheme
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
