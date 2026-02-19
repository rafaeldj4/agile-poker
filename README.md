# 🎴 AgileEstimate

**Scrum Poker / Planning Poker** para equipos ágiles — sin backend, sin registro, 100% local.

## ✨ Características

- 🎯 **Sesiones de estimación** con cartas Fibonacci (1, 2, 3, 5, 8, 13, 21) o T-Shirt (S, M, L, XL)
- 👥 **Gestión de participantes** con roles (Developer, QA, PO, SM)
- 📝 **Historias de usuario** con ID, título y descripción
- 🃏 **Sistema de votación** con reveal simultáneo
- 📊 **Resultados automáticos**: promedio, consenso, distribución
- 💾 **Persistencia local** usando localStorage
- 🌍 **Multiidioma** (Español / English)
- 🎨 **UI moderna** con Tailwind CSS y componentes accesibles
- 📱 **Responsive** para uso en desktop y móvil
- ⚡ **Sin dependencias de servidor** — funciona completamente offline

## 🛠️ Stack Tecnológico

| Capa | Tecnología |
|------|-----------|
| Framework | React 18 + Vite |
| Lenguaje | TypeScript |
| Estado | Zustand |
| UI | Tailwind CSS v4 + Radix UI |
| Íconos | Lucide React |
| i18n | react-i18next |
| Routing | React Router DOM v7 |
| Storage | localStorage |

## 🚀 Instalación

```bash
# Clonar el repositorio
git clone https://github.com/rafaeldj4/agile-poker.git
cd agile-poker

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev
```

El proyecto estará disponible en `http://localhost:5173`

## 📦 Scripts Disponibles

```bash
npm run dev        # Servidor de desarrollo
npm run build      # Build de producción
npm run preview    # Preview del build
npm run lint       # Ejecutar ESLint
```

## 🎮 Cómo Usar

1. **Crear Sesión**
   - Define nombre del sprint, facilitador y tipo de cartas

2. **Agregar Participantes**
   - Asigna nombres y roles al equipo

3. **Crear Historias**
   - Añade las user stories con ID y descripción

4. **Votar**
   - Selecciona un participante y vota con las cartas
   - Revelar cuando todos hayan votado

5. **Revisar Resultados**
   - Analiza promedio, consenso y distribución
   - Asigna estimación final a la historia

## 📁 Estructura del Proyecto

```
src/
├── components/
│   ├── ui/              # Componentes base (Button, Input, Dialog, etc.)
│   ├── layout/          # Header con toggle de idioma
│   ├── session/         # CreateSessionForm
│   ├── participants/    # ParticipantManager
│   ├── stories/         # StoryManager
│   └── voting/          # VotingBoard, ResultsPanel
├── pages/
│   ├── HomePage.tsx     # Pantalla principal
│   └── SessionPage.tsx  # Vista de sesión activa
├── store/
│   └── useAppStore.ts   # Estado global con Zustand
├── services/
│   └── storage.ts       # Wrapper de localStorage
├── utils/
│   ├── voting.ts        # Cálculos de consenso y promedios
│   └── cn.ts            # Utilidad de clases Tailwind
├── types/
│   └── index.ts         # Tipos TypeScript
└── i18n/
    ├── index.ts         # Configuración i18next
    └── locales/
        ├── es.ts        # Traducciones español
        └── en.ts        # Traducciones inglés
```

## 🌐 Internacionalización

La app detecta automáticamente el idioma del navegador y permite cambiar entre español e inglés mediante el toggle en el header.

## 🔒 Privacidad

Todos los datos se almacenan **exclusivamente en tu navegador** usando localStorage. No hay servidor, no hay backend, no hay tracking.

## 🚧 Próximas Funcionalidades

- [ ] Exportar/Importar sesiones (JSON)
- [ ] PWA (Progressive Web App)
- [ ] Dark mode
- [ ] Temporizador de votación
- [ ] Historial de votaciones por historia

## 📄 Licencia

MIT

## 🤝 Contribuir

Las contribuciones son bienvenidas. Por favor:
1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

---

Hecho con ❤️ para equipos ágiles
