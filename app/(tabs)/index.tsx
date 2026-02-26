import React, { useState, useEffect } from 'react'
import { useAuth, useUser } from '@clerk/clerk-expo'
import { ThemedText } from '@/components/themed-text'
import { ThemedView } from '@/components/themed-view'
import { Link } from 'expo-router'
import { StyleSheet, ScrollView, TouchableOpacity } from 'react-native'
import { supabase } from '../lib/supabase'
import { Ionicons } from '@expo/vector-icons';

export default function Page() {
  const { user } = useUser();
  const { signOut } = useAuth();
  const [perfil, setPerfil] = useState<any>(null);

  useEffect(() => {
    if (user) {
      getProfile();
    }
  }, [user]);

  async function getProfile() {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('email', user?.emailAddresses[0].emailAddress)
      .single();

    if (data) setPerfil(data);
    if (error) console.log('Erro Supabase:', error.message);
  }

  return (
    <ThemedView style={styles.container}>
      {/* Cabeçalho Premium - Corrigido para remover a caixa branca */}
      <ThemedView style={styles.header}>
        <ThemedView style={{ backgroundColor: 'transparent' }}>
          <ThemedText style={styles.welcomeText}>
            Olá, {perfil?.username?.split(' ')[0] || 'Colaborador'}!
          </ThemedText>
          <ThemedText style={styles.subTitle}>Painel Corporativo CKsup</ThemedText>
        </ThemedView>
        <ThemedView style={styles.avatarCircle}>
          <Ionicons name="person-circle-outline" size={32} color="#fff" />
        </ThemedView>
      </ThemedView>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {user ? (
          <>
            {/* Card Principal: Cargo e Empresa */}
            <ThemedView style={styles.mainCard}>
              <ThemedView style={styles.iconBox}>
                <Ionicons name="briefcase" size={28} color="#0a7ea4" />
              </ThemedView>
              <ThemedView style={{ flex: 1, backgroundColor: 'transparent' }}>
                <ThemedText style={styles.label}>Cargo Atual</ThemedText>
                <ThemedText style={styles.value}>{perfil?.cargo || "Gerente Regional"}</ThemedText>
                <ThemedText style={styles.companyName}>🏢 {perfil?.empresa || "CKsup Corp"}</ThemedText>
              </ThemedView>
            </ThemedView>

            {/* Grid de Informações de Contrato */}
            <ThemedText style={styles.sectionTitle}>Detalhes Profissionais</ThemedText>
            <ThemedView style={styles.grid}>
              <ThemedView style={styles.smallCard}>
                <Ionicons name="document-text-outline" size={20} color="#0a7ea4" />
                <ThemedText style={styles.smallLabel}>Contrato</ThemedText>
                <ThemedText style={styles.smallValue}>{perfil?.contrato || "CLT Full"}</ThemedText>
              </ThemedView>

              <ThemedView style={styles.smallCard}>
                <Ionicons name="calendar-clear-outline" size={20} color="#0a7ea4" />
                <ThemedText style={styles.smallLabel}>Início</ThemedText>
                <ThemedText style={styles.smallValue}>{perfil?.inicio || "01/02/2024"}</ThemedText>
              </ThemedView>
            </ThemedView>

            {/* Card de Comunicação */}
            <ThemedView style={styles.infoRow}>
              <Ionicons name="mail-outline" size={22} color="#666" />
              <ThemedView style={{ marginLeft: 15, backgroundColor: 'transparent' }}>
                <ThemedText style={styles.label}>E-mail Corporativo</ThemedText>
                <ThemedText style={styles.infoValue}>{user.emailAddresses[0].emailAddress}</ThemedText>
              </ThemedView>
            </ThemedView>

            {/* Ações Rápidas */}
            <ThemedText style={[styles.sectionTitle, { marginTop: 20 }]}>Ações rápidas</ThemedText>
            
            <TouchableOpacity style={styles.actionButton}>
              <Ionicons name="settings-outline" size={22} color="#333" />
              <ThemedText style={styles.actionText}>Configurações de Acesso</ThemedText>
              <Ionicons name="chevron-forward" size={18} color="#ccc" />
            </TouchableOpacity>

            {/* Botão de Sair Estilizado */}
            <ThemedView style={styles.footer}>
              <TouchableOpacity 
                style={styles.logoutBtn} 
                onPress={() => signOut()}
              >
                <Ionicons name="power" size={20} color="#fff" style={{ marginRight: 10 }} />
                <ThemedText style={styles.logoutText}>Encerrar Sessão</ThemedText>
              </TouchableOpacity>
            </ThemedView>
          </>
        ) : (
          <ThemedView style={styles.loginContainer}>
            <Ionicons name="lock-closed" size={60} color="#ccc" />
            <ThemedText style={{ marginTop: 10 }}>Sessão expirada.</ThemedText>
            <Link href="/(auth)/sign-in" style={styles.loginLink}>
              <ThemedText type="link">Voltar para o Login</ThemedText>
            </Link>
          </ThemedView>
        )}
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FB' },
  header: {
    backgroundColor: '#0a7ea4',
    paddingTop: 65,
    paddingHorizontal: 25,
    paddingBottom: 45,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomLeftRadius: 35,
    borderBottomRightRadius: 35,
    elevation: 10,
  },
  welcomeText: { fontSize: 26, fontWeight: 'bold', color: '#FFFFFF' },
  subTitle: { fontSize: 14, color: 'rgba(255, 255, 255, 0.7)', marginTop: 4 },
  avatarCircle: {
    width: 55, height: 55, borderRadius: 28,
    backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center',
  },
  content: { flex: 1, paddingHorizontal: 22, marginTop: -25 },
  mainCard: {
    backgroundColor: '#fff', borderRadius: 22, padding: 20, flexDirection: 'row',
    alignItems: 'center', elevation: 8, marginBottom: 20,
  },
  iconBox: {
    width: 65, height: 65, borderRadius: 18, backgroundColor: '#EBF5F9',
    justifyContent: 'center', alignItems: 'center', marginRight: 15,
  },
  label: { fontSize: 10, color: '#999', textTransform: 'uppercase', fontWeight: '700' },
  value: { fontSize: 20, fontWeight: 'bold', color: '#333' },
  companyName: { fontSize: 14, color: '#666', marginTop: 2 },
  sectionTitle: { fontSize: 17, fontWeight: 'bold', color: '#222', marginBottom: 12 },
  grid: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  smallCard: { backgroundColor: '#fff', width: '48%', padding: 16, borderRadius: 20, elevation: 3 },
  smallLabel: { fontSize: 11, color: '#888', marginTop: 8 },
  smallValue: { fontSize: 14, fontWeight: '700', color: '#444' },
  infoRow: { backgroundColor: '#fff', padding: 18, borderRadius: 20, flexDirection: 'row', alignItems: 'center', elevation: 2 },
  infoValue: { fontSize: 15, fontWeight: '600', color: '#333' },
  actionButton: {
    backgroundColor: '#fff', flexDirection: 'row', alignItems: 'center',
    padding: 18, borderRadius: 18, marginBottom: 12, borderWidth: 1, borderColor: '#F0F0F0',
  },
  actionText: { flex: 1, marginLeft: 15, fontSize: 15, color: '#444' },
  footer: { marginTop: 35, marginBottom: 50, alignItems: 'center' },
  logoutBtn: {
    backgroundColor: '#E74C3C', flexDirection: 'row', paddingVertical: 16,
    paddingHorizontal: 45, borderRadius: 35, alignItems: 'center', justifyContent: 'center', elevation: 6,
  },
  logoutText: { color: '#FFFFFF', fontWeight: 'bold', fontSize: 16 },
  loginContainer: { alignItems: 'center', marginTop: 120 },
  loginLink: { marginTop: 20 }
});