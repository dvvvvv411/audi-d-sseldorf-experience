export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
      aktivitaets_log: {
        Row: {
          aktion: string
          anfrage_id: string | null
          created_at: string
          details: string | null
          id: string
          user_email: string
        }
        Insert: {
          aktion: string
          anfrage_id?: string | null
          created_at?: string
          details?: string | null
          id?: string
          user_email: string
        }
        Update: {
          aktion?: string
          anfrage_id?: string | null
          created_at?: string
          details?: string | null
          id?: string
          user_email?: string
        }
        Relationships: []
      }
      anfrage_notizen: {
        Row: {
          anfrage_id: string
          created_at: string
          id: string
          text: string
        }
        Insert: {
          anfrage_id: string
          created_at?: string
          id?: string
          text: string
        }
        Update: {
          anfrage_id?: string
          created_at?: string
          id?: string
          text?: string
        }
        Relationships: []
      }
      anfragen: {
        Row: {
          auftragsnummer: string | null
          branding_name: string
          created_at: string
          datenschutz_akzeptiert: boolean
          email: string
          fahrzeug_id: string
          fahrzeug_name: string
          fahrzeug_preis: number
          hidden: boolean
          id: string
          nachname: string
          nachricht: string
          notizen: string | null
          plz: string | null
          redirect_id: string | null
          stadt: string | null
          status: string
          strasse: string | null
          telefon: string
          verkaeufer_id: string
          verkaeufer_name: string
          vorname: string
        }
        Insert: {
          auftragsnummer?: string | null
          branding_name: string
          created_at?: string
          datenschutz_akzeptiert?: boolean
          email: string
          fahrzeug_id: string
          fahrzeug_name: string
          fahrzeug_preis: number
          hidden?: boolean
          id?: string
          nachname: string
          nachricht: string
          notizen?: string | null
          plz?: string | null
          redirect_id?: string | null
          stadt?: string | null
          status?: string
          strasse?: string | null
          telefon: string
          verkaeufer_id: string
          verkaeufer_name: string
          vorname: string
        }
        Update: {
          auftragsnummer?: string | null
          branding_name?: string
          created_at?: string
          datenschutz_akzeptiert?: boolean
          email?: string
          fahrzeug_id?: string
          fahrzeug_name?: string
          fahrzeug_preis?: number
          hidden?: boolean
          id?: string
          nachname?: string
          nachricht?: string
          notizen?: string | null
          plz?: string | null
          redirect_id?: string | null
          stadt?: string | null
          status?: string
          strasse?: string | null
          telefon?: string
          verkaeufer_id?: string
          verkaeufer_name?: string
          vorname?: string
        }
        Relationships: []
      }
      brandings: {
        Row: {
          absendername: string | null
          amtsgericht: string
          created_at: string
          email: string
          email_absender: string | null
          geschaeftsfuehrer: string
          handelsregister: string
          id: string
          name: string
          plz: string
          resend_api_key: string | null
          sevenio_absendername: string | null
          stadt: string
          strasse: string
          ust_id: string
        }
        Insert: {
          absendername?: string | null
          amtsgericht: string
          created_at?: string
          email: string
          email_absender?: string | null
          geschaeftsfuehrer: string
          handelsregister: string
          id?: string
          name: string
          plz: string
          resend_api_key?: string | null
          sevenio_absendername?: string | null
          stadt: string
          strasse: string
          ust_id: string
        }
        Update: {
          absendername?: string | null
          amtsgericht?: string
          created_at?: string
          email?: string
          email_absender?: string | null
          geschaeftsfuehrer?: string
          handelsregister?: string
          id?: string
          name?: string
          plz?: string
          resend_api_key?: string | null
          sevenio_absendername?: string | null
          stadt?: string
          strasse?: string
          ust_id?: string
        }
        Relationships: []
      }
      cloaker_redirects: {
        Row: {
          action_created: boolean
          callback_sent_at: string | null
          captcha_solved: boolean
          created_at: string
          id: string
          ip_address: string | null
          redirect_id: string
          user_agent: string | null
        }
        Insert: {
          action_created?: boolean
          callback_sent_at?: string | null
          captcha_solved?: boolean
          created_at?: string
          id?: string
          ip_address?: string | null
          redirect_id: string
          user_agent?: string | null
        }
        Update: {
          action_created?: boolean
          callback_sent_at?: string | null
          captcha_solved?: boolean
          created_at?: string
          id?: string
          ip_address?: string | null
          redirect_id?: string
          user_agent?: string | null
        }
        Relationships: []
      }
      fahrzeuge: {
        Row: {
          aktiv: boolean
          antrieb: string | null
          auftragsnummer: string | null
          beschreibung: string | null
          bilder: string[] | null
          created_at: string
          erstzulassung: string | null
          fahrgestellnummer: string | null
          fahrzeugname: string
          farbe: string | null
          getriebe: string | null
          hubraum: number | null
          id: string
          innenausstattung: string | null
          km_stand: number | null
          kraftstoff: string | null
          kw: number | null
          preis: number
          ps: number | null
          servicenachweis_urls: string[] | null
          sitze: number | null
          tueren: number | null
          tuev_au: string | null
        }
        Insert: {
          aktiv?: boolean
          antrieb?: string | null
          auftragsnummer?: string | null
          beschreibung?: string | null
          bilder?: string[] | null
          created_at?: string
          erstzulassung?: string | null
          fahrgestellnummer?: string | null
          fahrzeugname: string
          farbe?: string | null
          getriebe?: string | null
          hubraum?: number | null
          id?: string
          innenausstattung?: string | null
          km_stand?: number | null
          kraftstoff?: string | null
          kw?: number | null
          preis: number
          ps?: number | null
          servicenachweis_urls?: string[] | null
          sitze?: number | null
          tueren?: number | null
          tuev_au?: string | null
        }
        Update: {
          aktiv?: boolean
          antrieb?: string | null
          auftragsnummer?: string | null
          beschreibung?: string | null
          bilder?: string[] | null
          created_at?: string
          erstzulassung?: string | null
          fahrgestellnummer?: string | null
          fahrzeugname?: string
          farbe?: string | null
          getriebe?: string | null
          hubraum?: number | null
          id?: string
          innenausstattung?: string | null
          km_stand?: number | null
          kraftstoff?: string | null
          kw?: number | null
          preis?: number
          ps?: number | null
          servicenachweis_urls?: string[] | null
          sitze?: number | null
          tueren?: number | null
          tuev_au?: string | null
        }
        Relationships: []
      }
      mailbox_clicks: {
        Row: {
          anfrage_id: string
          clicked_at: string
          id: string
        }
        Insert: {
          anfrage_id: string
          clicked_at?: string
          id?: string
        }
        Update: {
          anfrage_id?: string
          clicked_at?: string
          id?: string
        }
        Relationships: []
      }
      telegram_chat_ids: {
        Row: {
          chat_id: string
          created_at: string
          id: string
          label: string | null
        }
        Insert: {
          chat_id: string
          created_at?: string
          id?: string
          label?: string | null
        }
        Update: {
          chat_id?: string
          created_at?: string
          id?: string
          label?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      verkaeufer: {
        Row: {
          avatar_url: string | null
          branding_id: string | null
          created_at: string
          email: string
          id: string
          nachname: string
          telefon: string
          vorname: string
        }
        Insert: {
          avatar_url?: string | null
          branding_id?: string | null
          created_at?: string
          email: string
          id?: string
          nachname: string
          telefon: string
          vorname: string
        }
        Update: {
          avatar_url?: string | null
          branding_id?: string | null
          created_at?: string
          email?: string
          id?: string
          nachname?: string
          telefon?: string
          vorname?: string
        }
        Relationships: [
          {
            foreignKeyName: "verkaeufer_branding_id_fkey"
            columns: ["branding_id"]
            isOneToOne: false
            referencedRelation: "brandings"
            referencedColumns: ["id"]
          },
        ]
      }
      verkaeufer_fahrzeuge: {
        Row: {
          created_at: string
          fahrzeug_id: string
          id: string
          verkaeufer_id: string
        }
        Insert: {
          created_at?: string
          fahrzeug_id: string
          id?: string
          verkaeufer_id: string
        }
        Update: {
          created_at?: string
          fahrzeug_id?: string
          id?: string
          verkaeufer_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "verkaeufer_fahrzeuge_fahrzeug_id_fkey"
            columns: ["fahrzeug_id"]
            isOneToOne: false
            referencedRelation: "fahrzeuge"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "verkaeufer_fahrzeuge_verkaeufer_id_fkey"
            columns: ["verkaeufer_id"]
            isOneToOne: false
            referencedRelation: "verkaeufer"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin"],
    },
  },
} as const
