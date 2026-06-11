'use client'
import { useNav } from '../hooks/useNav'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { PhoneInput } from 'react-international-phone'
import 'react-international-phone/style.css'
import { isValidPhoneNumber } from 'libphonenumber-js'
import * as Yup from 'yup'
import toast from 'react-hot-toast'
import { register } from '../api/auth'

const schema = Yup.object({
  name:            Yup.string().required('Full name is required').min(2, 'Name must be at least 2 characters'),
  phone:           Yup.string().required('Phone number is required').test('valid-phone', 'Enter a valid phone number', v => !!v && isValidPhoneNumber(v)),
  email:           Yup.string().required('Email is required').email('Enter a valid email address'),
  password:        Yup.string()
    .min(8, 'Must be at least 8 characters long')
    .matches(/[a-z]/, 'Must contain at least one lowercase letter')
    .matches(/[A-Z]/, 'Must contain at least one uppercase letter')
    .matches(/\d/, 'Must contain at least one number')
    .matches(/[!@#$%^&*(),.?":{}|<>]/, 'Must contain at least one special character')
    .required('Password is required'),
  confirmPassword: Yup.string().required('Please confirm your password').oneOf([Yup.ref('password')], "Passwords don't match"),
  agreed:          Yup.boolean().oneOf([true], 'You must accept the terms to continue'),
})

type Fields = { name: string; phone: string; email: string; password: string; confirmPassword: string; agreed: boolean }
type FieldErrors = Partial<Record<keyof Fields, string>>

export default function Signup() {
  const go = useNav()
  const router = useRouter()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [agreed, setAgreed] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})
  const [loading, setLoading] = useState(false)

  function clearField(field: keyof FieldErrors) {
    setFieldErrors(prev => ({ ...prev, [field]: undefined }))
  }

  async function handleSignup() {
    setFieldErrors({})
    try {
      await schema.validate({ name, phone, email, password, confirmPassword, agreed }, { abortEarly: false })
    } catch (err) {
      if (err instanceof Yup.ValidationError) {
        const errs: FieldErrors = {}
        err.inner.forEach(e => { if (e.path) errs[e.path as keyof FieldErrors] = e.message })
        setFieldErrors(errs)
      }
      return
    }
    setLoading(true)
    try {
      await register({ display_name: name, email, password, phone: phone || undefined })
      toast.success('Account created! Check your email for the verification code.')
      setTimeout(() => router.push(`/verify?email=${encodeURIComponent(email)}`), 1500)
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : 'Signup failed')
    } finally {
      setLoading(false)
    }
  }

  const inputCls = (field: keyof FieldErrors) =>
    `w-full py-3 px-3.5 rounded-xl border font-sans text-3.75 text-ink outline-none transition-colors duration-150 bg-paper ${fieldErrors[field] ? 'border-coral' : 'border-line'}`
  const labelCls = 'text-xs font-semibold text-ink2 block mb-1.75'
  const errCls = 'text-[11px] text-coral mt-1'

  return (
    <div className="min-h-[calc(100vh-74px)] grid grid-cols-1 md:grid-cols-2 font-sans">

      {/* ── Left panel ── */}
      <div className="hidden md:flex flex-col py-15 px-14 relative overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1683336474667-420dabe065b5?q=80&w=1471&auto=format&fit=crop)' }} />
        <div className="absolute inset-0"
          style={{ background: 'linear-gradient(135deg, rgba(0,8,24,.97) 0%, rgba(0,16,46,.88) 30%, rgba(0,20,50,.55) 60%, rgba(0,10,30,.18) 100%)' }} />

        <div className="relative">
          <button onClick={() => go('landing')} className="bg-transparent border-0 cursor-pointer p-0 mb-12 block">
            <img src="/iLoveDRRealty_White.png" alt="I Love DR Realty" className="h-10 w-auto block" />
          </button>

          <div className="text-2.75 font-bold tracking-[.18em] uppercase text-gold mb-3.5">Create your account</div>
          <h1 className="font-sans text-[clamp(26px,3vw,40px)] font-extrabold text-white leading-[1.1] tracking-[-.02em] mb-4.5 max-w-90">
            Join{' '}
            <span className="text-coral">12,000+</span> buyers, investors, and realtors
          </h1>
          <p className="text-3.75 text-white/65 leading-[1.7] max-w-80 mb-10">
            Free to join. Verified listings. A bilingual team that's lived the process.
          </p>
        </div>
      </div>

      {/* ── Right panel — form ── */}
      <div className="bg-paper2 flex items-center justify-center py-10 sm:py-12 px-4 sm:px-7 overflow-y-auto">
        <div className="w-full max-w-110">

          <h2 className="font-sans text-7 font-bold text-ink mb-1.5 tracking-[-.02em]">Create account</h2>
          <p className="text-[14.5px] text-ink2 mb-7">
            Already have an account?{' '}
            <button onClick={() => go('login')}
              className="bg-transparent border-0 cursor-pointer text-coral font-bold text-[14.5px] font-sans p-0">
              Log in
            </button>
          </p>

          <div className="bg-paper border border-line rounded-2xl p-5 sm:p-7">

            {/* Name */}
            <div className="mb-3.5">
              <label className={labelCls}>Full name</label>
              <input value={name} onChange={e => { setName(e.target.value); clearField('name') }} placeholder="Maria Rodríguez" className={inputCls('name')} />
              {fieldErrors.name && <p className={errCls}>{fieldErrors.name}</p>}
            </div>

            {/* Phone */}
            <div className="mb-3.5">
              <label className={labelCls}>Phone / WhatsApp</label>
              <PhoneInput
                defaultCountry="do"
                value={phone}
                onChange={v => { setPhone(v); clearField('phone') }}
                placeholder="+1 (809) 000-0000"
                inputStyle={{
                  flex: 1, width: '100%', outline: 'none',
                  border: '1px solid #e4ddcf', borderLeft: 'none',
                  borderRadius: '0 0.75rem 0.75rem 0',
                  background: '#ffffff', padding: '0.75rem 0.875rem',
                  fontFamily: 'inherit', fontSize: '0.9375rem', color: '#00102e',
                  height: 'auto', boxSizing: 'border-box',
                }}
                countrySelectorStyleProps={{
                  buttonStyle: {
                    border: '1px solid #e4ddcf', borderRight: 'none',
                    borderRadius: '0.75rem 0 0 0.75rem',
                    background: '#ffffff', padding: '0 0.75rem',
                    cursor: 'pointer', height: '100%',
                  },
                }}
                style={{ width: '100%', display: 'flex' }}
              />
              {fieldErrors.phone && <p className={errCls}>{fieldErrors.phone}</p>}
            </div>

            {/* Email */}
            <div className="mb-3.5">
              <label className={labelCls}>Email address</label>
              <input type="email" value={email} onChange={e => { setEmail(e.target.value); clearField('email') }} placeholder="you@email.com" className={inputCls('email')} />
              {fieldErrors.email && <p className={errCls}>{fieldErrors.email}</p>}
            </div>

            {/* Password */}
            <div className="mb-3.5">
              <label className={labelCls}>Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => { setPassword(e.target.value); clearField('password') }}
                  placeholder="At least 8 characters"
                  className={`${inputCls('password')} pr-10`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 bg-transparent border-0 cursor-pointer p-0 text-ink2 hover:text-ink transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/>
                      <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/><line x1="2" x2="22" y1="2" y2="22"/>
                    </svg>
                  ) : (
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z"/><circle cx="12" cy="12" r="3"/>
                    </svg>
                  )}
                </button>
              </div>
              {fieldErrors.password && <p className={errCls}>{fieldErrors.password}</p>}
            </div>

            {/* Confirm password */}
            <div className="mb-5">
              <label className={labelCls}>Confirm password</label>
              <div className="relative">
                <input
                  type={showConfirm ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={e => { setConfirmPassword(e.target.value); clearField('confirmPassword') }}
                  placeholder="Re-enter password"
                  className={`${inputCls('confirmPassword')} pr-10`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 bg-transparent border-0 cursor-pointer p-0 text-ink2 hover:text-ink transition-colors"
                  tabIndex={-1}
                >
                  {showConfirm ? (
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/>
                      <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/><line x1="2" x2="22" y1="2" y2="22"/>
                    </svg>
                  ) : (
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z"/><circle cx="12" cy="12" r="3"/>
                    </svg>
                  )}
                </button>
              </div>
              {fieldErrors.confirmPassword && <p className={errCls}>{fieldErrors.confirmPassword}</p>}
            </div>

            {/* Terms */}
            <div className="mb-4.5">
              <label className="flex items-start gap-2.25 text-[12.5px] text-ink2 leading-normal cursor-pointer">
                <input type="checkbox" checked={agreed} onChange={e => { setAgreed(e.target.checked); clearField('agreed') }}
                  className="accent-coral w-3.75 h-3.75 mt-0.5 shrink-0" />
                <span>
                  I agree to the{' '}
                  <button className="bg-transparent border-0 cursor-pointer text-sea font-semibold font-sans text-[12.5px] p-0">Terms & Conditions</button>
                  {' '}and{' '}
                  <button className="bg-transparent border-0 cursor-pointer text-sea font-semibold font-sans text-[12.5px] p-0">Privacy Policy</button>
                  .
                </span>
              </label>
              {fieldErrors.agreed && <p className={errCls}>{fieldErrors.agreed}</p>}
            </div>


            <button
              onClick={handleSignup}
              disabled={loading}
              className="w-full py-3.25 rounded-full border-none font-sans text-3.75 font-bold transition-colors duration-150 bg-coral text-white cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating account…' : 'Create account'}
            </button>

            <div className="flex items-center gap-3 mt-4.5 mb-3.5">
              <div className="flex-1 h-px bg-line" />
              <span className="text-xs text-dim font-medium">or sign up with</span>
              <div className="flex-1 h-px bg-line" />
            </div>

            <button className="w-full py-2.75 rounded-full font-sans text-sm font-semibold cursor-pointer bg-white border border-[#dadce0] text-[#3c4043] flex items-center justify-center gap-3 hover:bg-[#f8f9fa] transition-colors duration-150">
              <svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
                <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z" fill="#4285F4"/>
                <path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853"/>
                <path d="M3.964 10.707A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.707V4.961H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.039l3.007-2.332z" fill="#FBBC05"/>
                <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.961L3.964 7.293C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
              </svg>
              Continue with Google
            </button>
          </div>

        </div>
      </div>

    </div>
  )
}
