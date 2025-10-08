"use client";
import { useAuth } from '@/app/context/AuthContext';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

// Assume you have these components for a clean UI
import { Button } from '@/components/ui/button'; 
import { CheckCircle, ArrowRight, Workflow, Lock, FileText, Signature, Check } from 'lucide-react'; 
import FormalConsentForm from './FormalConsentForm';
import Image from 'next/image';
import { useToast } from '@/hooks/use-toast';

const WelcomePage = () => {
    const { user, userDoc } = useAuth();
    const router = useRouter();

    const { toast } = useToast();

    // STATE FOR CONSENT FORM
    const [hasConsented, setHasConsented] = useState(false);
    
    // ... (useEffect and loading state logic remain the same) ...

    useEffect(() => {
        if (userDoc && userDoc.subscriptionStatus !== 'trialing') {
            router.replace('/orders'); 
        }
    }, [userDoc, router]);

    if (!userDoc) {
        return <div className='py-6 bg-gray-200 text-center'>Loading setup data...</div>;
    }

    // Determine Connection Status from userDoc
    const connections = userDoc.connections || {}; 
    const isWhatsappConnected = connections.whatsapp;
    const isZohoConnected = connections.zoho;
    const isGoogleConnected = connections.googleContacts;
    
    // Check if ALL connections are complete
    const isAllConnected = isWhatsappConnected && isZohoConnected && isGoogleConnected;

    // ... (connectionSteps array remains the same) ...
    const connectionSteps = [
        { 
            name: "WhatsApp Business", 
            description: "Connect your official WhatsApp number to send and receive messages.", 
            connected: isWhatsappConnected,
            connectPath: "/api/setup/connect-whatsapp", 
            buttonClr:"#199083", 
            icon:"/connections/whatsapp-business-ico.svg"
        },
        { 
            name: "Zoho CRM", 
            description: "Integrate with Zoho to sync customer data and activities.", 
            connected: isZohoConnected,
            connectPath: "/api/setup/connect-zoho",
            buttonClr:"#4990E2",
            icon:"/connections/zoho.webp"
        },
        { 
            name: "Google Account (Drive & Contacts)", 
            description: "Sync your Google Contacts and allow access to Drive for data/report storage.", 
            connected: isGoogleConnected,
            connectPath: "/api/setup/connect-google",
            buttonClr:"#E02735",
            icon:"/connections/google.png"
        },
    ];

    // ... (ConnectButtonWithLogo component remains the same) ...
    const ConnectButtonWithLogo = ({ step, router, disabled }) => {
        const logoSize = 'w-8 h-8';
        const customStyle = {
            backgroundColor: step.buttonClr,
            color: 'white',
        };
        
        if (step.connected) {
            return (
                <div className="flex items-center text-green-600 font-medium space-x-2">
                    <CheckCircle className="w-5 h-5 fill-green-500 text-white" />
                    <span>Connected</span>
                </div>
            );
        }

        // function to let user connect accounts
        const handleConnect = async ({step}:{step:string}) => {
            try {
                const res = await fetch(step);
                // const data = await res.json();

                
            } catch (error) {
                 toast({ title: "Connection failed", variant: "destructive" });
            }
        }

        return (
            <button
                onClick={() => handleConnect({step: step.connectPath})}
                disabled={disabled}
                className={`flex items-center space-x-2 p-1 pl-1.5 pr-3 rounded-full text-white shadow-md transition-shadow ${
                    disabled ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-lg'
                }`}
                style={customStyle}
            >
                <div className={`p-1 rounded-full bg-white flex items-center justify-center ${logoSize}`}>
                    <Image
                        src={step.icon} 
                        alt={`${step.name} Logo`} 
                        className="w-full h-full object-contain rounded-full"
                        width={50}
                        height={50}
                    />
                </div>
                <span className="text-sm font-semibold">
                    Connect
                </span>
            </button>
        );
    };

  

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Banner (remains the same) */}
            <div className='py-8 bg-white border-b border-gray-200 text-center'>
                <h1 className='md:text-5xl text-3xl font-extrabold text-gray-900 tracking-tight'>
                    Welcome, <span className="text-purple-600">{user?.displayName?.split(" ")[0] || 'User'}</span>! 👋
                </h1>
                <p className='md:text-xl text-md mt-3 px-4  text-gray-500 font-light max-w-2xl mx-auto'>
                    Let's get your platform connected. Complete the quick setup below to begin.
                </p>
                <div></div>
            </div>

            {/* Main Content Area */}
            <div className="max-w-3xl mx-auto p-6 space-y-10">

                {/* 1. FORMAL CONSENT AGREEMENT */}
                <FormalConsentForm hasConsented={hasConsented} setHasConsented={setHasConsented} user={user} />

                {/* 2. ESSENTIAL SYSTEM CONNECTIONS (Disabled if consent is not given) */}
                <div 
                    className={`p-8 bg-white rounded-xl shadow-2xl border border-gray-100 transition-all duration-300 ${
                        !hasConsented ? 'opacity-30 pointer-events-none' : 'opacity-100'
                    }`}
                > 
                    
                    {/* Step Header */}
                    <h2 className="flex items-center space-x-3 text-2xl font-bold text-gray-800 border-b pb-4 mb-8">
                        <Workflow className='w-6 h-6 text-purple-600' />
                        <span>Essential System Connections</span>
                    </h2>

                    {/* Connection Checklist Items */}
                    <ol className="relative space-y-8 mb-10">
                        {connectionSteps.map((step, index) => (
                            <li key={step.name} className={`flex items-start ${index < connectionSteps.length - 1 ? 'border-l-2 border-dashed border-gray-200 ml-5 pl-5' : 'ml-5 pl-5'}`}>
                                
                                {/* Timeline Circle */}
                                <span 
                                    className={`flex-shrink-0 absolute -left-6 top-0 p-1.5 rounded-full ${step.connected ? 'bg-green-100' : 'bg-white border-2 border-gray-300'}`}
                                >
                                    {step.connected ? (
                                        <CheckCircle className="w-5 h-5 fill-green-600 text-white" />
                                    ) : (
                                        <div className="w-5 h-5 rounded-full bg-gray-400 text-white flex items-center justify-center font-bold text-xs">{index+1}</div>
                                    )}
                                </span>
                                
                                <div className="flex justify-between items-center w-full">
                                    <div className="pr-4">
                                        <h3 className={`text-xl font-bold ${step.connected ? 'text-gray-500' : 'text-gray-900'}`}>
                                            {step.name}
                                        </h3>
                                        <p className="text-sm text-gray-500 mt-1">{step.description}</p>
                                    </div>
                                    
                                    {/* Action Button: Disabled if hasConsented is FALSE */}
                                    <ConnectButtonWithLogo step={step} router={router} disabled={!hasConsented} />
                                </div>
                            </li>
                        ))}
                    </ol>

                    {/* Final Action / Progress Block */}
                    <div className="mt-12 pt-6 border-t border-gray-200 text-center">
                        {isAllConnected ? (
                            <div className="space-y-4">
                                 <p className={`text-lg font-medium flex items-center justify-center text-green-600`}>
                                     <CheckCircle className="w-5 h-5 mr-2" /> All Setup Complete!
                                </p>
                                <Button 
                                    onClick={() => router.push('/dashboard')}
                                    className="text-lg px-10 py-6 bg-purple-600 hover:bg-purple-700 shadow-xl font-semibold"
                                >
                                    Go to Dashboard
                                    <ArrowRight className='w-5 h-5 ml-2'/>
                                </Button>
                            </div>
                        ) : (
                            <p className="text-center text-md text-gray-600">
                                Connect your essential accounts to finish your setup.
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default WelcomePage;