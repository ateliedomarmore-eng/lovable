-- Create categories table
CREATE TABLE IF NOT EXISTS public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  color TEXT NOT NULL DEFAULT '#3b82f6',
  type TEXT NOT NULL CHECK (type IN ('entrada', 'saida')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create entradas (income entries) table
CREATE TABLE IF NOT EXISTS public.entradas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  description TEXT NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  date DATE NOT NULL,
  category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create saidas (expense entries) table
CREATE TABLE IF NOT EXISTS public.saidas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  description TEXT NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  date DATE NOT NULL,
  category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create contas_pagar (accounts payable) table
CREATE TABLE IF NOT EXISTS public.contas_pagar (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  description TEXT NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  due_date DATE NOT NULL,
  category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  status TEXT NOT NULL DEFAULT 'a_vencer' CHECK (status IN ('a_vencer', 'vencido', 'pago')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create contas_receber (accounts receivable) table
CREATE TABLE IF NOT EXISTS public.contas_receber (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  description TEXT NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  due_date DATE NOT NULL,
  category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  status TEXT NOT NULL DEFAULT 'a_receber' CHECK (status IN ('a_receber', 'atrasado', 'recebido')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create tarefas (tasks) table
CREATE TABLE IF NOT EXISTS public.tarefas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  due_date DATE,
  completed BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.entradas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saidas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contas_pagar ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contas_receber ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tarefas ENABLE ROW LEVEL SECURITY;

-- RLS Policies for categories
CREATE POLICY "Users can view their own categories"
  ON public.categories FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own categories"
  ON public.categories FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own categories"
  ON public.categories FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own categories"
  ON public.categories FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies for entradas
CREATE POLICY "Users can view their own entradas"
  ON public.entradas FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own entradas"
  ON public.entradas FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own entradas"
  ON public.entradas FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own entradas"
  ON public.entradas FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies for saidas
CREATE POLICY "Users can view their own saidas"
  ON public.saidas FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own saidas"
  ON public.saidas FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own saidas"
  ON public.saidas FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own saidas"
  ON public.saidas FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies for contas_pagar
CREATE POLICY "Users can view their own contas_pagar"
  ON public.contas_pagar FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own contas_pagar"
  ON public.contas_pagar FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own contas_pagar"
  ON public.contas_pagar FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own contas_pagar"
  ON public.contas_pagar FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies for contas_receber
CREATE POLICY "Users can view their own contas_receber"
  ON public.contas_receber FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own contas_receber"
  ON public.contas_receber FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own contas_receber"
  ON public.contas_receber FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own contas_receber"
  ON public.contas_receber FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies for tarefas
CREATE POLICY "Users can view their own tarefas"
  ON public.tarefas FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own tarefas"
  ON public.tarefas FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own tarefas"
  ON public.tarefas FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own tarefas"
  ON public.tarefas FOR DELETE
  USING (auth.uid() = user_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_categories_updated_at
  BEFORE UPDATE ON public.categories
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_entradas_updated_at
  BEFORE UPDATE ON public.entradas
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_saidas_updated_at
  BEFORE UPDATE ON public.saidas
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_contas_pagar_updated_at
  BEFORE UPDATE ON public.contas_pagar
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_contas_receber_updated_at
  BEFORE UPDATE ON public.contas_receber
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_tarefas_updated_at
  BEFORE UPDATE ON public.tarefas
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();