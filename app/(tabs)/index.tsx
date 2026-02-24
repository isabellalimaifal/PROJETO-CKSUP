import React, { useState, useEffect } from 'react'
import { SignOutButton } from '@/components/sign-out-button'
import { ThemedText } from '@/components/themed-text'
import { ThemedView } from '@/components/themed-view'
import { SignedIn, SignedOut, useSession, useUser } from '@clerk/clerk-expo'
import { Link } from 'expo-router'
import { StyleSheet } from 'react-native'
import { supabase } from '../lib/supabase'

export default function Page() {
  const { user } = useUser();
  const [perfil, setPerfil] = useState<any>(null);

  useEffect(() => {
    if (user) {
      getProfile();
    }
  }, [user]);

  async function getProfile() {
    // Busca na tabela 'profiles' onde o email é igual ao do Clerk
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('email', user?.emailAddresses[0].emailAddress)
      .single();

    if (data) setPerfil(data);
    if (error) console.log('Erro Supabase:', error.message);
  }

return (
    <ThemedView style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
      <ThemedText type="title">Bem-vindo ao CKsup!</ThemedText>
      
      {/* 1. Verifica se o Clerk carregou o usuário */}
      {user ? (
        <ThemedView style={{ marginTop: 20, alignItems: 'center' }}>
          <ThemedText>Logado como: **{user.emailAddresses[0].emailAddress}**</ThemedText>
          
          {/* 2. Verifica se o perfil foi encontrado no Supabase */}
          {perfil ? (
            <ThemedView style={{ backgroundColor: '#f0f0f0', padding: 15, borderRadius: 10, marginTop: 10 }}>
              <ThemedText style={{ color: '#000' }}>🏢 Empresa: **{perfil.empresa}**</ThemedText>
              <ThemedText style={{ color: '#000' }}>👤 Nome: **{perfil.username}**</ThemedText>
            </ThemedView>
          ) : (
            <ThemedText style={{ marginTop: 10, color: 'orange' }}>
              Buscando dados no Supabase... (Verifique se o e-mail no banco é igual ao logado)
            </ThemedText>
          )}

          <ThemedView style={{ marginTop: 30 }}>
            <SignOutButton />
          </ThemedView>
        </ThemedView>
      ) : (
        <ThemedView style={{ marginTop: 20 }}>
          <ThemedText>Você não está logado.</ThemedText>
          <Link href="/(auth)/sign-in">
             <ThemedText type="link">Ir para Login</ThemedText>
          </Link>
        </ThemedView>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    gap: 16,
  },
})