import { c } from '../design'

export const I = {
  msg:   'M20 2H4a2 2 0 00-2 2v14l4-4h14a2 2 0 002-2V4a2 2 0 00-2-2z',
  cal:   'M8 2v3M16 2v3M3 8h18M5 4h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V6a2 2 0 012-2z',
  globe: 'M12 2a10 10 0 100 20A10 10 0 0012 2zm0 0c-2.8 2.7-4.5 6.3-4.5 10s1.7 7.3 4.5 10m0-20c2.8 2.7 4.5 6.3 4.5 10s-1.7 7.3-4.5 10M2 12h20',
  arrow: 'M5 12h14M12 5l7 7-7 7',
  phone: 'M22 16.9v3a2 2 0 01-2.2 2 19.8 19.8 0 01-8.6-3.1 19.4 19.4 0 01-6-6 19.8 19.8 0 01-3.1-8.7A2 2 0 014.1 2h3a2 2 0 012 1.7c.1 1.1.4 2.2.7 3.2a2 2 0 01-.4 2.1L8.1 10c1.4 2.6 3.4 4.6 6 6l1-.9a2 2 0 012.1-.5c1 .4 2 .6 3.2.7A2 2 0 0122 17z',
  map:   'M12 2C8.1 2 5 5.1 5 9c0 5.3 7 13 7 13s7-7.7 7-13c0-3.9-3.1-7-7-7zm0 9.5a2.5 2.5 0 110-5 2.5 2.5 0 010 5z',
}

export const CHANNELS = [
  { icon: I.msg,   title: 'WhatsApp',     desc: 'Fastest reply — chat with our team', value: '+1 (809) 555-0147', color: c.green },
  { icon: I.cal,   title: 'Book a call',  desc: 'Free 15-min discovery call',          value: 'Schedule now →',   color: c.coral },
  { icon: I.globe, title: 'Office',        desc: 'Av. Winston Churchill, Santo Domingo', value: 'Mon–Sat · 9am–6pm', color: c.sea },
]
