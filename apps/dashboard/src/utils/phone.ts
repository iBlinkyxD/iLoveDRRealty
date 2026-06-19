import { parsePhoneNumber } from 'libphonenumber-js'

function parse(raw: string) {
  const digits = raw.replace(/\D/g, '')
  if (raw.trim().startsWith('+')) return parsePhoneNumber(raw.trim())
  if (digits.length === 11 && digits[0] === '1') return parsePhoneNumber('+' + digits)
  return parsePhoneNumber(raw, 'US')
}

export interface PhoneInfo {
  formatted: string
  country: string | null
}

export function parsePhone(raw: string | null | undefined): PhoneInfo {
  if (!raw) return { formatted: '', country: null }
  try {
    const phone = parse(raw)
    if (phone?.isValid()) {
      return { formatted: phone.formatInternational(), country: phone.country ?? null }
    }
  } catch {}
  return { formatted: raw, country: null }
}

export function fmtPhone(raw: string | null | undefined): string {
  return parsePhone(raw).formatted || raw || ''
}
