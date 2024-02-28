import React from 'react'
import { FluentBundle, FluentResource, FluentNumber, FluentFunction, FluentValue } from '@fluent/bundle'
import { LocalizationProvider as LP, ReactLocalization } from '@fluent/react'
import zh_CN from './zh_CN'
import { maybeHas } from '~/src/types'

const LangMap: Record<string, string> = {
  'zh-CN': zh_CN
}
const BundleMap: Record<string, FluentBundle> = {}
const Langs = ['zh-CN']
const functions: Record<string, FluentFunction> = {
  DIV([a, b]: FluentValue[]) {
    return new FluentNumber(Number(a) / Number(b))
  },
  STRLEN([str]: FluentValue[]) {
    return new FluentNumber(String(str).length)
  },
  MINUS([a, b]: FluentValue[]) {
    return new FluentNumber(Number(a) - Number(b))
  },
  CMP([a, b]: FluentValue[]) {
    if (a === b) {
      return 'EQ'
    } else if (a > b) {
      return 'GT'
    } else {
      return 'LT'
    }
  },
  STR([n]: FluentValue[]) {
    return n
  },
  MAYBE_HAS([n]: FluentValue[]) {
    return maybeHas(n) ? 'has' : 'none'
  }
}

for (const locale of Object.keys(LangMap)) {
  const bundle = new FluentBundle(locale, {
    functions
  })
  bundle.addResource(new FluentResource(LangMap[locale]))
  BundleMap[locale] = bundle
}

const langs = [chrome.i18n.getUILanguage(), ...Langs]
const bundles = langs.map(i => BundleMap[i]).filter(Boolean)
const l10n = new ReactLocalization(bundles)

export const LocalizationProvider: React.FC = ({ children }) => {
  return <LP l10n={l10n}>
    <>{children}</>
  </LP>
}
