import { Link } from 'react-router-dom';
import { MapPin, Coins, Trophy, Gift, ChevronRight, HelpCircle } from 'lucide-react';

const steps = [
  {
    number: '01',
    icon: <MapPin size={28} className="text-blue-400" />,
    emoji: '📍',
    title: 'Ache uma máquina',
    description:
      'Use o mapa do site para encontrar um bar parceiro PlayPrize perto de você. São 6 locais espalhados por São Paulo, abertos todos os dias.',
    tip: 'Dica: bares em Pinheiros e Itaim costumam ter mais movimento nos finais de semana.',
    color: 'blue',
  },
  {
    number: '02',
    icon: <Coins size={28} className="text-purple-400" />,
    emoji: '🪙',
    title: 'Insira a ficha e jogue',
    description:
      'Compre fichas no caixa do bar. Cada ficha dá direito a uma partida completa. Não é preciso criar conta, login ou qualquer cadastro.',
    tip: 'Quanto mais partidas, mais chances de bater o recorde. Cada jogada começa do zero.',
    color: 'purple',
  },
  {
    number: '03',
    icon: <Trophy size={28} className="text-yellow-400" />,
    emoji: '🏆',
    title: 'Bata o maior score',
    description:
      'O score fica visível na tela da máquina e no site em tempo real. Seu objetivo: superar o líder do dia, da semana ou do mês.',
    tip: 'O ranking mostra apenas seu nickname — nenhum dado pessoal é necessário para jogar.',
    color: 'yellow',
  },
  {
    number: '04',
    icon: <Gift size={28} className="text-pink-400" />,
    emoji: '🎁',
    title: 'Ganhe sem burocracia',
    description:
      'Se você está na liderança quando o prazo encerrar, a máquina exibe a mensagem de vitória. Mostre ao barman e retire seu prêmio na hora.',
    tip: 'Para o Grand Prize mensal em dinheiro, o contato é feito pelo site. Nenhum CPF antes de ganhar.',
    color: 'pink',
  },
];

const colorMap = {
  blue: { ring: 'border-blue-500/30', glow: 'rgba(59,130,246,0.15)', num: 'text-blue-500', badge: 'bg-blue-500/10 text-blue-400' },
  purple: { ring: 'border-purple-500/30', glow: 'rgba(168,85,247,0.15)', num: 'text-purple-500', badge: 'bg-purple-500/10 text-purple-300' },
  yellow: { ring: 'border-yellow-500/30', glow: 'rgba(234,179,8,0.15)', num: 'text-yellow-500', badge: 'bg-yellow-500/10 text-yellow-400' },
  pink: { ring: 'border-pink-500/30', glow: 'rgba(236,72,153,0.15)', num: 'text-pink-500', badge: 'bg-pink-500/10 text-pink-400' },
};

const faqs = [
  {
    q: 'Preciso criar conta para jogar?',
    a: 'Não. Você compra a ficha no bar, insere na máquina e joga. Cadastro só é necessário para retirar um prêmio após vencer.',
  },
  {
    q: 'Preciso informar CPF?',
    a: 'Nunca antes de ganhar. Somente para o Grand Prize mensal em dinheiro, pedimos um dado para transferência. Prêmios em consumação no bar são entregues na hora, sem burocracia.',
  },
  {
    q: 'O que acontece se eu bater o recorde?',
    a: 'A máquina exibe uma mensagem de parabéns e registra seu nickname no ranking. Ao encerrar o período, você recebe instruções na tela e no site para retirar o prêmio.',
  },
  {
    q: 'Quanto custa cada partida?',
    a: 'O valor da ficha varia por bar, geralmente entre R$ 5 e R$ 10. Consulte o bar parceiro para o preço atual.',
  },
  {
    q: 'Posso jogar quantas vezes quiser?',
    a: 'Sim! Cada ficha é uma partida. Você pode jogar o quanto quiser para tentar superar o score do líder.',
  },
  {
    q: 'O ranking é atualizado em tempo real?',
    a: 'Sim. Cada partida finalizada atualiza o ranking instantaneamente no site e na tela da máquina.',
  },
];

export function HowItWorks() {
  return (
    <div className="min-h-screen py-16">
      {/* Header */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center mb-16">
        <p className="text-purple-400 text-xs font-semibold uppercase tracking-widest mb-3">Simples. Direto. Justo.</p>
        <h1 className="font-game font-bold text-white text-3xl sm:text-4xl mb-4">Como Funciona</h1>
        <p className="text-slate-400 text-lg leading-relaxed">
          Arcade clássico com prêmios reais. Sem app, sem cadastro, sem complicação.
          Só você e o joystick.
        </p>
      </div>

      {/* Steps */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 mb-20">
        <div className="space-y-6">
          {steps.map((step, i) => {
            const c = colorMap[step.color as keyof typeof colorMap];
            return (
              <div
                key={i}
                className={`flex flex-col sm:flex-row gap-6 p-6 sm:p-8 rounded-2xl border ${c.ring} relative overflow-hidden`}
                style={{ background: `rgba(10,0,20,0.9)`, boxShadow: `0 0 30px ${c.glow}` }}
              >
                {/* Number */}
                <div className={`font-game font-black text-7xl opacity-10 absolute top-4 right-6 ${c.num} leading-none select-none`}>
                  {step.number}
                </div>

                {/* Icon */}
                <div className={`w-16 h-16 rounded-2xl border ${c.ring} flex items-center justify-center text-3xl shrink-0`}
                  style={{ background: `rgba(10,0,20,0.8)`, boxShadow: `0 0 20px ${c.glow}` }}>
                  {step.emoji}
                </div>

                {/* Content */}
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className={`text-xs font-bold uppercase tracking-widest ${c.num}`}>{step.number}</span>
                    <h2 className="font-game font-bold text-white text-lg">{step.title}</h2>
                  </div>
                  <p className="text-slate-300 leading-relaxed mb-3">{step.description}</p>
                  <div className={`inline-flex items-start gap-2 px-4 py-2 rounded-xl ${c.badge} text-sm`}>
                    <span className="text-base leading-none shrink-0">💡</span>
                    <span>{step.tip}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Prize tiers */}
      <div className="bg-[#0a0018] py-16 mb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="font-game font-bold text-white text-2xl sm:text-3xl mb-10">Estrutura de Prêmios</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {[
              { emoji: '⚡', label: 'Prêmio do Dia', value: 'R$ 50', desc: 'em consumação no bar', period: 'Encerra à meia-noite', color: 'blue' },
              { emoji: '🔥', label: 'Prêmio da Semana', value: 'R$ 250', desc: 'em créditos no bar', period: 'Encerra no domingo', color: 'purple' },
              { emoji: '👑', label: 'Grand Prize', value: 'R$ 1.000', desc: 'em dinheiro', period: 'Encerra no último dia do mês', color: 'yellow' },
            ].map((tier, i) => {
              const c = colorMap[tier.color as keyof typeof colorMap];
              return (
                <div key={i} className={`rounded-2xl border ${c.ring} p-6 text-center`}
                  style={{ background: 'rgba(10,0,20,0.9)', boxShadow: `0 0 25px ${c.glow}` }}>
                  <div className="text-4xl mb-3">{tier.emoji}</div>
                  <p className={`text-xs font-bold uppercase tracking-widest mb-2 ${c.num}`}>{tier.label}</p>
                  <p className="font-game font-black text-3xl text-white mb-1">{tier.value}</p>
                  <p className="text-sm text-slate-400 mb-2">{tier.desc}</p>
                  <p className="text-xs text-slate-600">{tier.period}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* FAQ */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 mb-16">
        <div className="flex items-center gap-3 mb-8">
          <HelpCircle size={22} className="text-purple-400" />
          <h2 className="font-game font-bold text-white text-2xl">Perguntas Frequentes</h2>
        </div>
        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <details key={i} className="group card-neon rounded-xl overflow-hidden">
              <summary className="flex items-center justify-between p-5 cursor-pointer list-none">
                <span className="font-semibold text-white text-sm pr-4">{faq.q}</span>
                <ChevronRight size={16} className="text-purple-400 shrink-0 transition-transform group-open:rotate-90" />
              </summary>
              <div className="px-5 pb-5">
                <p className="text-slate-400 text-sm leading-relaxed">{faq.a}</p>
              </div>
            </details>
          ))}
        </div>
      </div>

      {/* Final CTA */}
      <div className="max-w-2xl mx-auto px-4 sm:px-6 text-center">
        <p className="text-slate-400 text-lg mb-6">Pronto para jogar?</p>
        <Link to="/mapa" className="inline-flex items-center gap-2 px-8 py-4 rounded-xl text-base font-bold text-white btn-primary">
          <MapPin size={18} />
          Encontrar a máquina mais próxima
        </Link>
      </div>
    </div>
  );
}
