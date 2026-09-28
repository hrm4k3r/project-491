"use client";

import { useSyncExternalStore } from "react";
import { Lancamento } from "./types";

const STORAGE_KEY = "viagem.lancamentos";
const listeners = new Set<() => void>();
let cache: Lancamento[] = [];

function readFromStorage(): Lancamento[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot(): Lancamento[] {
  return cache;
}

function getServerSnapshot(): Lancamento[] {
  return [];
}

function notify() {
  cache = readFromStorage();
  for (const listener of listeners) listener();
}

export function useLancamentos(): Lancamento[] {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

export function setLancamentos(itens: Lancamento[]) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(itens));
  notify();
}

if (typeof window !== "undefined") {
  cache = readFromStorage();
}
