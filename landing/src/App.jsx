import React, { useState, useEffect } from 'react';
import { 
  Sun, 
  Shield, 
  Glasses, 
  Sparkles, 
  Clock, 
  TrendingUp, 
  Activity, 
  Database, 
  Cpu, 
  Layers, 
  Wifi, 
  Bell, 
  ArrowRight, 
  CheckCircle2, 
  ExternalLink,
  AlertTriangle,
  Umbrella,
  Server
} from 'lucide-react';

// Detalles dinámicos según el valor de radiación UV (OMS)
const getUvDetails = (uv) => {
  if (uv <= 2) {
    return {
      risk: "Bajo",
      color: "var(--uv-low)",
      bgColor: "rgba(16, 185, 129, 0.12)",
      fps: "Mínimo SPF 15 - Ideal para actividades cotidianas.",
      glasses: "Opcional. Recomendado si la radiación solar directa te molesta.",
      hat: "Recomendado en horas pico de sol si estás al aire libre.",
      shadow: "Seguro permanecer bajo el sol sin mayor problema.",
      time: "60+",
      desc: "El peligro es mínimo. La mayoría de las personas pueden permanecer bajo el sol de forma segura."
    };
  } else if (uv <= 5) {
    return {
      risk: "Moderado",
      color: "var(--uv-moderate)",
      bgColor: "rgba(245, 158, 11, 0.12)",
      fps: "SPF 30+ - Aplica generosamente antes de salir.",
      glasses: "Sí. Gafas con protección UV400 obligatorias.",
      hat: "Sombrero de ala ancha y ropa ligera de manga larga.",
      shadow: "Busca la sombra en las horas de mayor intensidad solar (11 AM - 3 PM).",
      time: "30-45",
      desc: "Existe un riesgo moderado de daño por exposición al sol sin protección. Protégete en el exterior."
    };
  } else if (uv <= 7) {
    return {
      risk: "Alto",
      color: "var(--uv-high)",
      bgColor: "rgba(249, 115, 22, 0.12)",
      fps: "SPF 50+ - Reaplica cada 2 horas o después de nadar.",
      glasses: "Sí. Protección UV certificada para evitar fatiga ocular.",
      hat: "Gorra, sombrero y camisas protectoras son recomendados.",
      shadow: "Reduce el tiempo bajo el sol entre las 10 AM y las 4 PM.",
      time: "15-25",
      desc: "Se requiere protección adicional. El daño en la piel y los ojos puede ocurrir rápidamente."
    };
  } else if (uv <= 10) {
    return {
      risk: "Muy Alto",
      color: "var(--uv-veryhigh)",
      bgColor: "rgba(239, 68, 68, 0.12)",
      fps: "SPF 50+ - Protección extra. Evita contacto prolongado.",
      glasses: "Esenciales. Gafas envolventes de alta protección solar.",
      hat: "Sombrero completo, ropa de trama densa y uso de sombrilla.",
      shadow: "Evita la exposición directa al sol. Permanece en interiores.",
      time: "10-15",
      desc: "Riesgo muy alto de sufrir lesiones solares. Minimiza la exposición en las horas centrales del día."
    };
  } else {
    return {
      risk: "Extremo",
      color: "var(--uv-extreme)",
      bgColor: "rgba(168, 85, 247, 0.12)",
      fps: "SPF 50+ / Pantalla total - Aplica incluso a la sombra.",
      glasses: "Obligatorias. Gafas de sol de alta categoría (categoría 3 o 4).",
      hat: "Protección de ala ancha obligatoria. Ninguna zona de piel expuesta.",
      shadow: "Peligro severo. No permanezcas bajo el sol directo bajo ninguna circunstancia.",
      time: "5-10",
      desc: "Riesgo extremadamente alto. La piel desprotegida puede quemarse en pocos minutos."
    };
  }
};

function App() {
  // Estado para la lectura real del backend
  const [liveUv, setLiveUv] = useState(0);
  const [isOnline, setIsOnline] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(null);

  // Estado para el diagrama de arquitectura interactivo
  const [activeStep, setActiveStep] = useState(0);

  // Pasos del diagrama de arquitectura
  const steps = [
    {
      title: "Sensor IoT",
      desc: "El sensor de radiación UV (ML8511) detecta la intensidad luminosa analógica del espectro ultravioleta (280-390nm). El microcontrolador ESP32 procesa esta señal y calcula el índice UV local.",
      icon: <Cpu size={24} />,
      tech: "ESP32 / ML8511"
    },
    {
      title: "Transmisión MQTT",
      desc: "El microcontrolador publica las lecturas de forma inalámbrica a través del broker IoT Mosquitto bajo el tema 'uvshield/uv', usando un ancho de banda y consumo energético mínimo.",
      icon: <Wifi size={24} />,
      tech: "Mosquitto Broker"
    },
    {
      title: "Servidor Express",
      desc: "El servidor backend desarrollado en Node.js/Express actúa como suscriptor del broker MQTT. Procesa las lecturas entrantes y evalúa los niveles de riesgo según los estándares de la OMS.",
      icon: <Server size={24} />,
      tech: "Express / Node.js"
    },
    {
      title: "Base de Datos",
      desc: "Cada medición procesada se guarda automáticamente en una base de datos ligera SQLite3, registrando el valor UV junto con la marca de tiempo para posteriores análisis históricos.",
      icon: <Database size={24} />,
      tech: "SQLite3"
    },
    {
      title: "Alertas Telegram",
      desc: "Si la medición supera los umbrales de seguridad, el servidor realiza un POST HTTP a la API del bot de Telegram, distribuyendo de inmediato una alerta de protección detallada a un canal de usuarios.",
      icon: <Bell size={24} />,
      tech: "Telegram Bot API"
    },
    {
      title: "Dashboard Web",
      desc: "El panel de control visual en React consume los datos a través de una API REST de Express, graficando las tendencias con Chart.js y ofreciendo simuladores y widgets dinámicos.",
      icon: <Layers size={24} />,
      tech: "React / Chart.js"
    }
  ];

  // Efecto para consultar la API de UV del backend
  useEffect(() => {
    const fetchUv = async () => {
      try {
        const response = await fetch('/api/uv');
        if (response.ok) {
          const data = await response.json();
          if (data && data.length > 0) {
            setLiveUv(Number(data[0].uv_value));
            setIsOnline(true);
            setLastUpdate(new Date().toLocaleTimeString());
          }
        } else {
          setIsOnline(false);
        }
      } catch (error) {
        setIsOnline(false);
      }
    };

    fetchUv();
    const interval = setInterval(fetchUv, 3000); // Actualiza cada 3 segundos
    return () => clearInterval(interval);
  }, []);

  const currentDetails = getUvDetails(liveUv || 3.2); // Fallback en caso de desconexión
  const strokeDashoffset = 515.22 - (515.22 * Math.min(liveUv || 3.2, 15)) / 15;

  return (
    <>
      {/* Luces decorativas de fondo */}
      <div className="bg-glow-container">
        <div className="bg-glow-1"></div>
        <div className="bg-glow-2"></div>
      </div>

      {/* Cabecera */}
      <header className="header">
        <div className="container header-nav">
          <a href="#" className="logo">
            <div className="logo-icon-container">
              <Sun size={22} className="text-white" />
            </div>
            <div className="logo-text">
              <h1>UVShield</h1>
              <span>Monitoreo de Radiación Solar</span>
            </div>
          </a>
          
          <nav className="nav-links">
            <a href="#problema" className="nav-link">El Problema</a>
            <a href="#live-data" className="nav-link">Lectura en Vivo</a>
            <a href="#features" className="nav-link">Componentes</a>
            <a href="#architecture" className="nav-link">Arquitectura</a>
          </nav>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span className={`status-badge ${isOnline ? 'online' : 'offline'}`} style={{
              background: isOnline ? 'rgba(16, 185, 129, 0.1)' : 'rgba(249, 115, 22, 0.1)',
              borderColor: isOnline ? 'rgba(16, 185, 129, 0.2)' : 'rgba(249, 115, 22, 0.2)',
              color: isOnline ? '#10b981' : '#f97316'
            }}>
              <span className="status-dot" style={{
                backgroundColor: isOnline ? '#10b981' : '#f97316',
                animationName: isOnline ? 'pulse-green' : 'none'
              }}></span>
              {isOnline ? 'CONECTADO' : 'MODO DEMO'}
            </span>
            <a href="/dashboard.html" className="btn btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}>
              Ver Dashboard <ExternalLink size={14} />
            </a>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <div className="hero-tag">
            <Sparkles size={16} /> Monitoreo Inteligente de Rayos UV
          </div>
          <h1 className="hero-title">
            Protección Solar Inteligente<br />en Tiempo Real
          </h1>
          <p className="hero-subtitle">
            UVShield conecta hardware de medición solar con bases de datos dinámicas y bots de mensajería instantánea para alertarte y guiarte según los niveles de radiación solar en tu zona.
          </p>
          <div className="hero-ctas">
            <a href="#live-data" className="btn btn-primary">
              Ver Radiación Actual <Sun size={18} />
            </a>
            <a href="/dashboard.html" className="btn btn-secondary">
              Explorar Panel de Control <ArrowRight size={18} />
            </a>
          </div>
        </div>
      </section>

      {/* 1. ¿Qué problema resuelve? */}
      <section id="problema" className="container" style={{ padding: '3rem 2rem' }}>
        <div className="glass-card" style={{ borderLeftWidth: '5px', borderLeftColor: 'var(--color-orange)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem', color: 'var(--color-orange)' }}>
            <AlertTriangle size={28} />
            <h2 style={{ fontSize: '1.75rem', fontWeight: '750', margin: 0, color: '#fff' }}>¿Qué problema resuelve UVShield?</h2>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', marginBottom: '1.25rem', lineHeight: '1.7' }}>
            La radiación ultravioleta (UV) del sol es invisible y acumulativa. La exposición solar prolongada y sin protección es la causa principal de afecciones graves como **quemaduras térmicas, envejecimiento prematuro de la piel, cataratas oculares** y, fundamentalmente, incrementa drásticamente la tasa de incidencia de **cáncer de piel (melanoma)**.
          </p>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', lineHeight: '1.7' }}>
            Las aplicaciones de clima genéricas calculan el índice UV mediante pronósticos predictivos globales basados en satélites para regiones geográficas sumamente extensas. **UVShield ofrece mediciones locales de alta fidelidad tomadas in-situ**, alertando al usuario en su celular de manera inmediata si los niveles superan los límites de exposición segura e instruyéndolo con recomendaciones de cuidado basadas en la OMS.
          </p>
        </div>
      </section>

      {/* Live UV Widget Section */}
      <section className="live-widget-section" id="live-data">
        <div className="container">
          <div className="glass-card">
            <div className="widget-grid">
              
              {/* Lado del Medidor */}
              <div className="widget-visual">
                <div className="radial-gauge">
                  <svg className="gauge-svg" viewBox="0 0 200 200">
                    <circle cx="100" cy="100" r="82" className="gauge-track" />
                    <circle 
                      cx="100" 
                      cy="100" 
                      r="82" 
                      className="gauge-progress"
                      stroke={currentDetails.color}
                      strokeDasharray="515.22"
                      strokeDashoffset={strokeDashoffset}
                    />
                  </svg>
                  <div className="gauge-info">
                    <span className="gauge-lbl">ÍNDICE UV</span>
                    <span className="gauge-num" style={{ color: currentDetails.color }}>
                      {(isOnline ? liveUv : 3.2).toFixed(1)}
                    </span>
                    <span className="gauge-risk" style={{ 
                      backgroundColor: currentDetails.bgColor, 
                      color: currentDetails.color 
                    }}>
                      {currentDetails.risk}
                    </span>
                  </div>
                </div>
                {!isOnline && (
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '1rem' }}>
                    * Mostrando datos demostrativos (Servidor local desconectado)
                  </p>
                )}
              </div>

              {/* Lado de las Recomendaciones */}
              <div className="widget-details">
                <div className="widget-header-text">
                  <h3>Estado del Sol y Recomendaciones</h3>
                  <p>{currentDetails.desc}</p>
                </div>

                <div className="recommendations-list">
                  <div className="rec-card">
                    <div className="rec-card-icon">
                      <Shield size={18} />
                    </div>
                    <span className="rec-card-title">Protección FPS</span>
                    <span className="rec-card-desc">{currentDetails.fps}</span>
                  </div>

                  <div className="rec-card">
                    <div className="rec-card-icon">
                      <Glasses size={18} />
                    </div>
                    <span className="rec-card-title">Lentes de Sol</span>
                    <span className="rec-card-desc">{currentDetails.glasses}</span>
                  </div>

                  <div className="rec-card">
                    <div className="rec-card-icon">
                      <Sparkles size={18} />
                    </div>
                    <span className="rec-card-title">Gorra / Sombrero</span>
                    <span className="rec-card-desc">{currentDetails.hat}</span>
                  </div>

                  <div className="rec-card">
                    <div className="rec-card-icon">
                      <Umbrella size={18} />
                    </div>
                    <span className="rec-card-title">Exposición Segura</span>
                    <span className="rec-card-desc">{currentDetails.shadow}</span>
                  </div>
                </div>

                <div className="widget-footer">
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Clock size={16} /> Tiempo máximo de exposición segura: 
                    <strong style={{ color: currentDetails.color }}> {currentDetails.time} min</strong>
                  </span>
                  {lastUpdate && <span>Última lectura: {lastUpdate}</span>}
                </div>

              </div>

            </div>
          </div>
        </div>
      </section>

      {/* Features Section (Bento Grid) */}
      <section className="features-section" id="features">
        <div className="container">
          <div className="section-header">
            <h2>Tecnologías y Componentes de Hardware</h2>
            <p>
              Una solución IoT completa, diseñada con componentes modulares modernos para garantizar la fiabilidad del servicio de monitoreo.
            </p>
          </div>

          <div className="bento-grid">
            
            {/* Tarjeta MQTT */}
            <div className="glass-card bento-card bento-cyan bento-card-large">
              <div className="bento-icon-box">
                <Wifi size={24} />
              </div>
              <h4 className="bento-title">Protocolo Ligero MQTT</h4>
              <p className="bento-desc">
                El sensor de radiación publica sus lecturas periódicamente en milisegundos mediante el protocolo de mensajería IoT Mosquitto. Esto garantiza consumo energético mínimo y respuesta instantánea.
              </p>
              
              <div className="bento-mqtt-nodes" style={{ maxWidth: '300px' }}>
                <div className="mqtt-node">
                  <span>broker_mosquitto:1883</span>
                  <span className="badge">CONECTADO</span>
                </div>
                <div className="mqtt-node">
                  <span>canal/uvshield/uv</span>
                  <span style={{ color: 'var(--color-cyan)', fontSize: '0.8rem' }}>Escuchando...</span>
                </div>
              </div>
            </div>

            {/* Tarjeta Historial SQLite */}
            <div className="glass-card bento-card bento-card-tall">
              <div className="bento-icon-box">
                <Database size={24} />
              </div>
              <h4 className="bento-title">Base de Datos SQLite</h4>
              <p className="bento-desc" style={{ marginBottom: '1.5rem' }}>
                Todas las mediciones se almacenan automáticamente en una base de datos local ligera SQLite. Esto permite un análisis cronológico del comportamiento solar a lo largo de las semanas sin sobrecargar el servidor.
              </p>
              
              <div className="bento-db-sim">
                <span style={{ color: '#64748b' }}>// Ultima inserción</span><br />
                <span style={{ color: '#10b981' }}>INSERT INTO</span> uv_data(uv_value)<br />
                <span style={{ color: '#f59e0b' }}>VALUES</span>({(liveUv || 3.2).toFixed(1)});
              </div>
            </div>

            {/* Tarjeta Gráficas */}
            <div className="glass-card bento-card bento-orange bento-card-tall">
              <div className="bento-icon-box">
                <TrendingUp size={24} />
              </div>
              <h4 className="bento-title">Gráficos de Tendencia</h4>
              <p className="bento-desc">
                Visualiza el aumento y disminución de la radiación a lo largo de las horas. El dashboard interactivo expone gráficas dinámicas de la radiación con escalas cromáticas basadas en la OMS.
              </p>
              
              <div className="bento-chart-mini">
                <div className="bento-chart-bar" style={{ height: '35%' }}></div>
                <div className="bento-chart-bar" style={{ height: '55%' }}></div>
                <div className="bento-chart-bar" style={{ height: '80%' }}></div>
                <div className="bento-chart-bar" style={{ height: '65%' }}></div>
                <div className="bento-chart-bar" style={{ height: '40%' }}></div>
                <div className="bento-chart-bar" style={{ height: '90%' }}></div>
                <div className="bento-chart-bar" style={{ height: '70%' }}></div>
              </div>
            </div>

            {/* Tarjeta Telegram bot */}
            <div className="glass-card bento-card bento-card-large">
              <div className="bento-icon-box">
                <Bell size={24} />
              </div>
              <h4 className="bento-title">Notificaciones Inteligentes Telegram</h4>
              <p className="bento-desc">
                El bot analiza los cambios rápidos en la radiación solar y te advierte si de repente es necesario reaplicar filtro solar o buscar sombra, enviando reportes a un canal exclusivo de manera automática.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* 2. Arquitectura Interactiva */}
      <section className="arch-section" id="architecture">
        <div className="container">
          <div className="section-header">
            <h2>Cómo Funciona el Ecosistema</h2>
            <p>
              Una arquitectura limpia y coordinada que garantiza un flujo constante y fiable de información solar.
            </p>
          </div>

          <div className="arch-flow">
            {steps.map((step, idx) => (
              <div key={idx} className="arch-step-container">
                <div 
                  className={`arch-step ${activeStep === idx ? 'active' : ''}`}
                  onClick={() => setActiveStep(idx)}
                >
                  {step.icon}
                </div>
                <span className="arch-step-label">{step.title}</span>
                <span className="arch-step-desc">{step.tech}</span>
              </div>
            ))}
          </div>

          <div className="glass-card" style={{ marginTop: '3rem', borderLeftWidth: '4px', borderLeftColor: 'var(--color-primary)' }}>
            <h4 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <CheckCircle2 size={20} style={{ color: 'var(--color-primary)' }} />
              Detalle del Componente: {steps[activeStep].title}
            </h4>
            <p style={{ color: 'var(--text-secondary)' }}>
              {steps[activeStep].desc}
            </p>
            <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem', fontSize: '0.85rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>Tecnología principal:</span>
              <strong style={{ color: 'var(--text-primary)' }}>{steps[activeStep].tech}</strong>
            </div>
          </div>

        </div>
      </section>

      {/* 3. Fase del Proyecto */}
      <section className="container" style={{ padding: '4rem 2rem' }}>
        <div className="glass-card" style={{
          background: 'linear-gradient(135deg, rgba(13, 17, 39, 0.6) 0%, rgba(20, 26, 56, 0.6) 100%)',
        }}>
          <h2 style={{ fontSize: '1.75rem', fontWeight: '750', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Activity size={24} style={{ color: '#a855f7' }} />
            Fase Actual: Prototipado e Integración (Semana 11)
          </h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
            El sistema se encuentra en su fase de integración final. Hemos conectado con éxito el hardware de lectura solar (simulado y real) con la base de datos de producción y los canales de mensajería instantánea.
          </p>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '1.5rem'
          }}>
            <div>
              <h4 style={{ color: '#fff', fontSize: '1.05rem', fontWeight: '600', marginBottom: '1rem' }}>Completado y Validado</h4>
              <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                  <CheckCircle2 size={16} color="#10b981" /> Envío de lecturas por MQTT al broker
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                  <CheckCircle2 size={16} color="#10b981" /> Almacenamiento histórico en SQLite3
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                  <CheckCircle2 size={16} color="#10b981" /> Despacho de alertas automatizadas a Telegram
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                  <CheckCircle2 size={16} color="#10b981" /> Despliegue en servidor remoto con HTTPS
                </li>
              </ul>
            </div>

            <div>
              <h4 style={{ color: '#fff', fontSize: '1.05rem', fontWeight: '600', marginBottom: '1rem' }}>Siguientes Pasos</h4>
              <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                  <div style={{ width: '16px', height: '16px', borderRadius: '50%', border: '2px solid #f97316', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#f97316' }}></div>
                  </div>
                  Diseño de carcasa protectora impresa en 3D
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                  <div style={{ width: '16px', height: '16px', borderRadius: '50%', border: '2px solid #64748b' }}></div>
                  Pruebas de resistencia al sol y humedad en campo
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                  <div style={{ width: '16px', height: '16px', borderRadius: '50%', border: '2px solid #64748b' }}></div>
                  Implementación de alertas personalizables por usuario
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Tech Stack Horizontal section */}
      <section className="tech-section">
        <div className="container">
          <h3>TECNOLOGÍAS EMPLEADAS</h3>
          <div className="tech-grid">
            <div className="tech-item">
              <span className="tech-icon" style={{ color: '#61dafb' }}>React</span>
              <span className="tech-name">REACT</span>
            </div>
            <div className="tech-item">
              <span className="tech-icon" style={{ color: '#ffb300' }}>MQTT</span>
              <span className="tech-name">MQTT</span>
            </div>
            <div className="tech-item">
              <span className="tech-icon" style={{ color: '#339933' }}>Node</span>
              <span className="tech-name">NODE.JS</span>
            </div>
            <div className="tech-item">
              <span className="tech-icon" style={{ color: '#003b57' }}>SQLite</span>
              <span className="tech-name">SQLITE3</span>
            </div>
            <div className="tech-item">
              <span className="tech-icon" style={{ color: '#646cff' }}>Vite</span>
              <span className="tech-name">VITE</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-top">
            <div className="footer-brand">
              <div className="logo" style={{ marginBottom: '1rem' }}>
                <div className="logo-icon-container">
                  <Sun size={20} className="text-white" />
                </div>
                <div className="logo-text">
                  <h1 style={{ fontSize: '1.2rem' }}>UVShield</h1>
                </div>
              </div>
              <p>Proporcionando monitoreo seguro y alertas en tiempo real contra los daños solares.</p>
            </div>
            
            <div className="footer-links-column">
              <span className="footer-links-title">Proyecto</span>
              <a href="#live-data" className="footer-link">Datos en Vivo</a>
              <a href="#features" className="footer-link">Componentes</a>
              <a href="/dashboard.html" className="footer-link">Dashboard Original</a>
            </div>

            <div className="footer-links-column">
              <span className="footer-links-title">Seguridad Solar</span>
              <a href="https://www.who.int/es/news-room/questions-and-answers/item/radiation-the-ultraviolet-(uv)-index" target="_blank" rel="noreferrer" className="footer-link">
                Índice UV (OMS) <ExternalLink size={12} />
              </a>
              <a href="#" className="footer-link">Guía de Exposición</a>
            </div>
          </div>

          <div className="footer-bottom">
            <span>© 2026 UVShield. Todos los derechos reservados.</span>
            <span>Diseñado con tecnología web avanzada.</span>
          </div>
        </div>
      </footer>
    </>
  );
}

export default App;
