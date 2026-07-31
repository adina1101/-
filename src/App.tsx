import { Route, Switch } from 'wouter';
import { AppShell } from './components/AppShell';
import { AuthGate } from './components/AuthGate';
import { AppProvider } from './lib/app-context';
import { AuthProvider } from './lib/auth-context';
import { EconomyProvider } from './lib/economy-context';
import { CasinoPage } from './pages/CasinoPage';
import { FriendsPage } from './pages/FriendsPage';
import { GameDetailPage } from './pages/GameDetailPage';
import { GameSessionPage } from './pages/GameSessionPage';
import { HomePage } from './pages/HomePage';
import { NotFoundPage } from './pages/NotFoundPage';
import { PlayPage } from './pages/PlayPage';
import { PlayModePage } from './pages/PlayModePage';
import { ProfilePage } from './pages/ProfilePage';
import { RulesPage } from './pages/RulesPage';
import { SettingsPage } from './pages/SettingsPage';
import { ShopPage } from './pages/ShopPage';

export default function App() {
  return (
    <AuthProvider>
      <AuthGate>
       <AppProvider>
        <EconomyProvider>
         <AppShell>
        <Switch>
          <Route path="/" component={HomePage} />
          <Route path="/rules" component={RulesPage} />
          <Route path="/rules/:id">{({ id }) => <GameDetailPage id={id} />}</Route>
          <Route path="/play/:mode">{({ mode }) => <PlayModePage mode={mode} />}</Route>
          <Route path="/play" component={PlayPage} />
          <Route path="/game"><GameSessionPage /></Route>
          <Route path="/local-game"><GameSessionPage local /></Route>
          <Route path="/friends" component={FriendsPage} />
          <Route path="/profile" component={ProfilePage} />
          <Route path="/settings" component={SettingsPage} />
          <Route path="/shop" component={ShopPage} />
          <Route path="/casino" component={CasinoPage} />
          <Route component={NotFoundPage} />
        </Switch>
         </AppShell>
        </EconomyProvider>
       </AppProvider>
      </AuthGate>
    </AuthProvider>
  );
}
